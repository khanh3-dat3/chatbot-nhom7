<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/style.css">
    <link rel="stylesheet" href="./css/main.css">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css">
    <title>Khách sạn Khánh Phong Đạt</title>
</head>
<body class="body" style="margin:0%">
    <header class="index">
        <?php include("./view/logo.php"); ?>
        <nav>
            <ul>
                <li><a href="index.php">TRANG CHỦ</a></li>
            </ul>
        </nav>
    </header>
    <div class="intro">
    <?php include("./view/home.php")?>
    </div>
    <div class="lct">
        <?php include("./view/location.php")?>
    </div>

    <div class="chatbox">
        <div class="chatbox-header">
            <h4>Chat với chúng tôi</h4>
        </div>
        <div class="chatbox-body">
            <ul class="messages"></ul>
        </div>
        <div class="chatbox-footer">
            <input type="text" id="userMessage" placeholder="Nhập tin nhắn của bạn...">
            <button onclick="sendMessage()">Gửi</button>
        </div>
    </div>

    <script>
    // Lắng nghe sự kiện khi nhấn phím Enter trong input
    document.getElementById("userMessage").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) { // keyCode 13 tương đương với phím Enter
            sendMessage();
        }
    });

    // Hàm gửi tin nhắn
    function sendMessage() {
        var userMessage = document.getElementById("userMessage").value;
        if (userMessage.trim() !== "") {
            // Thêm tin nhắn của người dùng vào danh sách messages
            var messages = document.querySelector(".messages");
            var li = document.createElement("li");
            li.textContent = "Bạn: " + userMessage;
            messages.appendChild(li);
            // Gửi tin nhắn cho chatbot và xử lý phản hồi
            sendToChatbot(userMessage);
            // Xóa nội dung trong input
            document.getElementById("userMessage").value = "";
        }
    }


    function sendToChatbot(message) {
        var chatbotResponse = "Phản hồi từ chatbot: " + message;
        var messages = document.querySelector(".messages");
        var li = document.createElement("li");
        li.textContent = chatbotResponse;
        messages.appendChild(li);
        // Cuộn xuống cuối danh sách tin nhắn
        messages.scrollTop = messages.scrollHeight;
    }
</script>

    <div class="footer"><p><br><a href="index.php"style="text-decoration:none;color:white">Khách sạn Khánh Phong Đạt</a></p></div>

    <script src="./js/chatbot.js"></script>
    <script src="./js/index.js"></script>
</body>
</html>