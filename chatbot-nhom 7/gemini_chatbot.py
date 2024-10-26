import flask
from flask import Flask, request, jsonify, g
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import spacy
import mysql.connector
import requests
from datetime import datetime, timedelta
import re
from hotel_db import connect_db

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app)

# Load mô hình ngôn ngữ
nlp = spacy.load("en_core_web_sm")

# Thông tin kết nối cơ sở dữ liệu
db_config = {
    'host': "localhost",
    'database': "hotel_db",
    'user': "root",
    'password': ""
}

room_list = [
    'Deluxe Room',
    'Superior Room',
    'Standard Room'
]

area_list = [
    'City Center',
    'Beachfront',
    'Countryside'
]

bookings = {
    'room': None,
    'area': None,
    'room_list': room_list,
    'area_list': area_list,
    'price': None,
    'total_days': None,
    'total_price': None,
    'start_date': None,
    'end_date': None
}

def get_db_connection():
    if 'db' not in g:
        g.db = mysql.connector.connect(**db_config)
        g.cursor = g.db.cursor()
    return g.db, g.cursor

@app.teardown_appcontext
def close_db_connection(exception):
    db = g.pop('db', None)
    cursor = g.pop('cursor', None)
    if db is not None:
        cursor.close()
        db.close()

API_TOKEN = "AIzaSyA6mUp4ZDWbfSPNpBIp5-fgp2ATXlLd-nQ"


def get_response(user_message):
    """Fetches a response based on keywords in the user message."""
    print(f"Nhận được tin nhắn từ người dùng: {user_message}")
    db, cursor = get_db_connection()
    response = ""
    try:
        db = connect_db()
        cursor = db.cursor()

        if user_message.lower() == "hi""hello":
            response = "Xin chào, tôi có thể giúp gì cho quý khách?"
        elif "dịch vụ" in user_message.lower():
            cursor.execute("SELECT ten FROM dich_vu")
            services = cursor.fetchall()
            service_list = ", ".join([service[0] for service in services])
            response = f"Các dịch vụ của chúng tôi gồm có: {service_list}."
        elif "phòng" in user_message.lower() and 'room' not in bookings:
            cursor.execute("SELECT ten FROM phong")
            rooms = cursor.fetchall()
            room_list = ", ".join([room[0] for room in rooms])
            response = f"Quý khách muốn loại phòng nào?\n{room_list}"
            bookings['room'] = [room[0] for room in rooms]
        elif "khu vực" in user_message.lower() and 'area' not in bookings:
            cursor.execute("SELECT ten FROM khu_vuc")
            areas = cursor.fetchall()
            area_list = ", ".join([area[0] for area in areas])
            response = f"Quý khách muốn đặt phòng ở khu vực nào?\n{area_list}"
            bookings['area'] = [area[0] for area in areas]
        elif 'room' in bookings and 'area' in bookings and 'start_date' not in bookings:
            response = "Quý khách muốn đặt phòng từ ngày nào? (YYYY-MM-DD)"
        elif 'start_date' in bookings and 'end_date' not in bookings:
            start_date = user_message.strip()
            try:
                datetime.strptime(start_date, '%Y-%m-%d')
                bookings['start_date'] = start_date
                response = "Quý khách muốn đặt phòng đến ngày nào? (YYYY-MM-DD)"
            except ValueError:
                response = "Ngày không hợp lệ, vui lòng nhập lại (YYYY-MM-DD)."
        elif 'end_date' not in bookings:
            end_date = user_message.strip()
            try:
                datetime.strptime(end_date, '%Y-%m-%d')
                bookings['end_date'] = end_date
                bookings['total_days'] = (datetime.strptime(bookings['end_date'], '%Y-%m-%d') - datetime.strptime(bookings['start_date'], '%Y-%m-%d')).days
                cursor.execute("SELECT p.gia FROM phong p JOIN khu_vuc kv ON p.id = kv.id WHERE p.ten = %s AND kv.ten = %s",
                               (bookings['room'], bookings['area']))
                price = cursor.fetchone()
                if price:
                    bookings['price'] = price[0]
                    bookings['total_price'] = bookings['price'] * bookings['total_days']
                    response = (f"Quý khách có muốn đặt phòng {bookings['room']} ở khu vực {bookings['area']} với giá {bookings['price']} đồng/đêm "
                                f"với tổng số ngày là {bookings['total_days']} với số tiền là {bookings['total_price']} không?")
                else:
                    response = "Không tìm thấy phòng phù hợp."
            except ValueError:
                response = "Ngày không hợp lệ, vui lòng nhập lại (YYYY-MM-DD)."
        elif 'confirm' in user_message.lower() and 'room' in bookings and 'area' in bookings:
            response = "Vui lòng cung cấp thông tin cá nhân để đặt phòng: tên, số điện thoại, địa chỉ, email."
        else:
            response = "Xin chào, tôi có thể giúp gì cho quý khách?"
    except mysql.connector.Error as err:
        response = f"Lỗi cơ sở dữ liệu: {err}"
    
    return response, bookings

def book_room(name, phone, address, email, room_type, area):
    """Handles room booking."""
    db, cursor = get_db_connection()
    try:
        cursor.execute("INSERT INTO bookings (name, phone, address, email, room_type, area) VALUES (%s, %s, %s, %s, %s, %s)",
                       (name, phone, address, email, room_type, area))
        db.commit()
        return "Đặt phòng thành công!"
    except mysql.connector.Error as err:
        db.rollback()
        return f"Lỗi khi đặt phòng: {err}"

@app.route('/chatbot', methods=['POST'])
def process_message():
    user_message = request.json.get("message")
    print(f"Nhận được tin nhắn từ người dùng: {user_message}")
    response, bookings = get_response(user_message)
    print(f"Phản hồi chatbot: {response}")
    return jsonify({"response": response, "booking_info": bookings})

@app.route('/booking', methods=['POST'])
def booking():
    data = request.json.get("data")
    name = data.get('name')
    phone = data.get('phone')
    address = data.get('address')
    email = data.get('email')
    room = data.get('room')
    area = data.get('area')

    if not all([name, phone, address, email, room, area]):
        return jsonify({'error': 'Vui lòng cung cấp đầy đủ thông tin'}), 400

    result = book_room(name, phone, address, email, room, area)
    return jsonify({'message': result})

@socketio.on('chat message')
def handle_chat_message(data):
    user_message = data['message']
    response = get_response(user_message)
    emit('bot message', {'message': response})

@app.route('/')
def index():
    return "Chatbot API"

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5001)