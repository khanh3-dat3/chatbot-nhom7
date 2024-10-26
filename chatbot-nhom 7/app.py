from flask import Flask, request, jsonify
from hotel_db import connection, cursor
import mysql.connector
import requests

app = Flask(__name__)

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json.get("message")
    print(f"Nhận được tin nhắn từ người dùng: {user_message}")
    if not user_message:
        return jsonify({'response': 'Vui lòng cung cấp tin nhắn.'})
    response_message = get_response_from_gemini(user_message)
    return jsonify({"response": response_message})

def get_response_from_gemini(user_message):
    url = 'http://127.0.0.1:5001/chatbot' # Địa chỉ server Python
    headers = {'Content-type': 'application/json'}
    data = {'message': user_message}
    response = requests.post(url, json=data, headers=headers)
    print(f"Phản hồi từ gemini_chatbot.py: {response}")
    if response.status_code == 200:
        return response.json()['response']
    else:
        return "Có lỗi xảy ra khi kết nối với server."

@app.route('/booking', methods=['POST'])
def booking():
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')
    address = data.get('address')
    email = data.get('email')
    room = data.get('room')
    area = data.get('area')

    if not all([name, phone, address, email, room, area]):
        return jsonify({'error': 'Vui lòng cung cấp đầy đủ thông tin'}), 400

    # Thêm logic lưu thông tin đặt phòng vào cơ sở dữ liệu
    cursor.execute("INSERT INTO bookings (name, phone, address, email, room_type, area) VALUES (%s, %s, %s, %s, %s, %s)",
                   (name, phone, address, email, room, area))
    connection.commit()

    return jsonify({'message': 'Đặt phòng thành công!'})

if __name__ == "__main__":
    app.run(debug=True, port=5001)