let bookings = {}; // Định nghĩa biến bookings ở phạm vi toàn cục

function displayError(message) {
    const messages = document.querySelector(".chatbox-body .messages");
    const errorElement = document.createElement("li");
    errorElement.className = "message error-message";
    errorElement.innerHTML = `<strong>Lỗi:</strong> ${message}`;
    messages.appendChild(errorElement);
}

function displayMessage(message) {
    const messages = document.querySelector(".chatbox-body .messages");
    const botMessageElement = document.createElement("li");
    botMessageElement.className = "message bot-message";

    if (message) {
        botMessageElement.innerHTML = `<strong>Chatbot:</strong> ${message}`;
    } else {
        botMessageElement.innerHTML = `<strong>Chatbot:</strong> Có lỗi xảy ra khi xử lý phản hồi từ server.`;
    }

    messages.appendChild(botMessageElement);
    
    if (message.includes("Quý khách muốn loại phòng nào?")) {
        showRoomOptions();
    }

    if (message.includes("Quý khách muốn đặt phòng ở khu vực nào?")) {
        showAreaOptions();
    }

    if (message.includes("Vui lòng cung cấp thông tin khách hàng")) {
        requestCustomerInfo();
    }

    if (message.includes("Quý khách muốn đặt phòng mấy ngày?")) {
        showBookingDates();
    }

    if (message.includes("Quý khách có muốn đặt phòng")) {
        confirmBooking();
    }
}

function sendMessage() {
    const message = document.getElementById("userMessage").value;
    if (!message) return;

    // Hiển thị tin nhắn của người dùng
    const messages = document.querySelector(".chatbox-body .messages");
    const userMessageElement = document.createElement("li");
    userMessageElement.className = "message user-message";
    userMessageElement.innerHTML = `<strong>Bạn:</strong> ${message}`;
    messages.appendChild(userMessageElement);

    // Gửi tin nhắn lên server Python thông qua chatbot_api.php
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "chatbot_api.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (this.status == 200) {
            try {
                const response = JSON.parse(this.responseText);
                console.log("Phản hồi từ server:", response);
                
                // Kiểm tra phản hồi từ server Python
                if (response.response) {
                    displayMessage(response.response);
                } else if (response.message) {
                    displayMessage(response.message);
                } else {
                    displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
                }
                
                // Cập nhật booking_info
                if (response.booking_info) {
                    bookings = response.booking_info;
                } else {
                    bookings = {};
                }
            } catch (error) {
                console.error("Lỗi khi phân tích JSON:", error);
                displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
            }
        } else {
            console.error("Lỗi khi gửi yêu cầu:", this.status);
            displayError("Không thể kết nối với server.");
        }
    };
    xhr.onerror = function() {
        console.error("Lỗi kết nối mạng.");
        displayError("Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối.");
    };
    xhr.send(JSON.stringify({ "message": message }));

    document.getElementById("userMessage").value = "";
}

function showRoomOptions() {
    // booking_info.room_list chứa danh sách các loại phòng
    const roomList = bookings.room_list;
    if (roomList && roomList.length > 0) {
        const messages = document.querySelector(".chatbox-body .messages");
        const roomOptionsElement = document.createElement("li");
        roomOptionsElement.className = "message bot-message";
        roomOptionsElement.innerHTML = `<strong>Chatbot:</strong> Vui lòng chọn loại phòng:<br>${roomList.map(room => `<button onclick="selectRoom('${room}')">${room}</button>`).join('<br>')}`;
        messages.appendChild(roomOptionsElement);
    }
}

function selectRoom(room) {
    // Gửi loại phòng đã chọn lên server
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "chatbot_api.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (this.status == 200) {
            try {
                const response = JSON.parse(this.responseText);
                console.log("Phản hồi từ server:", response);
                if (response.message) {
                    displayMessage(response.message);
                } else {
                    displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
                }
                if (response.booking_info) {
                    bookings = response.booking_info;
                }
            } catch (error) {
                console.error("Lỗi khi phân tích JSON:", error);
                displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
            }
        } else {
            displayError("Có lỗi xảy ra khi gửi yêu cầu đến server.");
        }
    };
    xhr.send(JSON.stringify({ message: room, type: 'room_selection' }));
}

function showAreaOptions() {
    // booking_info.area_list chứa danh sách các khu vực
    const areaList = bookings.area_list;
    if (areaList && areaList.length > 0) {
        const messages = document.querySelector(".chatbox-body .messages");
        const areaOptionsElement = document.createElement("li");
        areaOptionsElement.className = "message bot-message";
        areaOptionsElement.innerHTML = `<strong>Chatbot:</strong> Vui lòng chọn khu vực:<br>${areaList.map(area => `<button onclick="selectArea('${area}')">${area}</button>`).join('<br>')}`;
        messages.appendChild(areaOptionsElement);
    }
}

function selectArea(area) {
    // Gửi khu vực đã chọn lên server
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "chatbot_api.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (this.status == 200) {
            try {
                const response = JSON.parse(this.responseText);
                console.log("Phản hồi từ server:", response);
                if (response.message) {
                    displayMessage(response.message);
                } else {
                    displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
                }
                if (response.booking_info) {
                    bookings = response.booking_info;
                }
            } catch (error) {
                console.error("Lỗi khi phân tích JSON:", error);
                displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
            }
        } else {
            displayError("Có lỗi xảy ra khi gửi yêu cầu đến server.");
        }
    };
    xhr.send(JSON.stringify({ message: area, type: 'area_selection' }));
}

function showBookingDates() {
    const messages = document.querySelector(".chatbox-body .messages");
    const bookingDatesElement = document.createElement("li");
    bookingDatesElement.className = "message bot-message";
    bookingDatesElement.innerHTML = `
        <strong>Chatbot:</strong> Quý khách muốn đặt phòng mấy ngày?<br>
        <label>Từ ngày:</label><input type="date" id="startDate"><br>
        <label>Đến ngày:</label><input type="date" id="endDate"><br>
        <button type="button" onclick="confirmBookingDates()">Xác nhận</button>
    `;
    messages.appendChild(bookingDatesElement);
}

function confirmBookingDates() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        displayError("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.");
        return;
    }

    // Gửi thông tin ngày lên server
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "chatbot_api.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (this.status == 200) {
            try {
                const response = JSON.parse(this.responseText);
                console.log("Phản hồi từ server:", response);
                if (response.response) {
                    displayMessage(response.response);
                } else if (response.message) {
                    displayMessage(response.message);
                } else {
                    displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
                }
            } catch (error) {
                console.error("Lỗi khi phân tích JSON:", error);
                displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
            }
        } else {
            displayError("Có lỗi xảy ra khi gửi yêu cầu đến server.");
        }
    };
    xhr.send(JSON.stringify({ startDate, endDate, type: 'booking_dates' }));
}

function confirmBooking() {
    const messages = document.querySelector(".chatbox-body .messages");
    const bookingConfirmElement = document.createElement("li");
    bookingConfirmElement.className = "message bot-message";
    bookingConfirmElement.innerHTML = `
        <strong>Chatbot:</strong> Quý khách có muốn đặt phòng ${bookings.room} ở khu vực ${bookings.area} với giá ${bookings.price} đồng/đêm với tổng số ngày là ${bookings.total_days} với số tiền là ${bookings.total_price}?
        <button type="button" onclick="confirmBookingFinal()">Xác nhận</button>
    `;
    messages.appendChild(bookingConfirmElement);
}

function confirmBookingFinal() {
    // Gửi thông tin xác nhận đặt phòng lên server
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "chatbot_api.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (this.status == 200) {
            try {
                const response = JSON.parse(this.responseText);
                console.log("Phản hồi từ server:", response);
                if (response.message) {
                    displayMessage(response.message);
                } else {
                    displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
                }
            } catch (error) {
                console.error("Lỗi khi phân tích JSON:", error);
                displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
            }
        } else {
            displayError("Có lỗi xảy ra khi gửi yêu cầu đến server.");
        }
    };
    xhr.send(JSON.stringify({ type: 'confirm_booking' }));
}

function requestCustomerInfo() {
    const messages = document.querySelector(".chatbox-body .messages");
    const infoElement = document.createElement("li");
    infoElement.className = "message bot-message";
    infoElement.innerHTML = `
        <strong>Chatbot:</strong> Vui lòng cung cấp thông tin cá nhân để đặt phòng:<br>
        <form id="customerInfoForm">
            <label>Tên:</label><input type="text" id="name"><br>
            <label>Số điện thoại:</label><input type="text" id="phone"><br>
            <label>Địa chỉ:</label><input type="text" id="address"><br>
            <label>Email:</label><input type="email" id="email"><br>
            <button type="button" onclick="submitCustomerInfo()">Gửi</button>
        </form>
    `;
    messages.appendChild(infoElement);
}

function submitCustomerInfo() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;

    if (!name || !phone || !address || !email) {
        displayError("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    // Gửi thông tin khách hàng lên server
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "chatbot_api.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (this.status == 200) {
            try {
                const response = JSON.parse(this.responseText);
                console.log("Phản hồi từ server:", response);
                if (response.message) {
                    displayMessage(response.message);
                } else {
                    displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
                }
            } catch (error) {
                console.error("Lỗi khi phân tích JSON:", error);
                displayError("Có lỗi xảy ra khi xử lý phản hồi từ server.");
            }
        } else {
            displayError("Có lỗi xảy ra khi gửi yêu cầu đến server.");
        }
    };
    xhr.send(JSON.stringify({ name, phone, address, email, room: bookings.room, area: bookings.area }));
}