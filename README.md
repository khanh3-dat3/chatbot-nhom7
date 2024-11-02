Mô tả Dự Án: Chatbot Đặt Phòng Khách Sạn Sử Dụng Flask và Flask-SocketIO
Dự án xây dựng một chatbot hỗ trợ khách hàng đặt phòng khách sạn, với khả năng xử lý các truy vấn của người dùng về dịch vụ khách sạn, loại phòng, khu vực và thời gian lưu trú. Chatbot được phát triển bằng Flask và Flask-SocketIO cho phép giao tiếp theo thời gian thực, đồng thời tích hợp MySQL để lưu trữ dữ liệu phòng và khu vực.
Các Tính Năng Chính:
1.	Giao Tiếp Theo Thời Gian Thực: Chatbot sử dụng Flask-SocketIO để trả lời tin nhắn của người dùng theo thời gian thực, cho phép giao tiếp hiệu quả và nhanh chóng.
2.	Quản Lý Thông Tin Đặt Phòng: Người dùng có thể cung cấp thông tin cá nhân và các yêu cầu đặt phòng thông qua chatbot. Dữ liệu sẽ được lưu vào MySQL để quản lý và xử lý đơn đặt phòng.
3.	Tích Hợp Trí Tuệ Nhân Tạo: Sử dụng thư viện spacy để phân tích ngôn ngữ tự nhiên, chatbot có khả năng nhận diện các từ khóa từ tin nhắn của người dùng, giúp nâng cao trải nghiệm và đáp ứng đúng nhu cầu.
4.	API và CORS: Các endpoint API REST được xây dựng để phục vụ các truy vấn của người dùng từ nhiều nền tảng khác nhau, với CORS cho phép các ứng dụng bên ngoài truy cập vào API một cách dễ dàng.
Công Nghệ Sử Dụng:
•	Flask, Flask-SocketIO
•	MySQL
•	Flask-CORS
•	Spacy (cho NLP)
•	HTML/JavaScript (giao diện người dùng)
Yêu Cầu Hệ Thống:
•	Python 3.x
•	MySQL
•	Môi trường ảo cho Flask và các thư viện cần thiết
Cách mở dự án để chạy:
Mở terminal chạy các câu lệnh như sau:
pip install flask flask-socketio langchain langchain-google-genai
pip install mysql-connector-python
pip install Flask Flask-Cors pika scikit-learn
npm install react react-dom axios
Cài đặt spaCy: pip install spacy
Tải xuống gói: Thử tải xuống gói vi_core_news_sm trực tiếp từ kho lưu trữ: python -m spacy download en_core_web_sm
pip install langchain_community
