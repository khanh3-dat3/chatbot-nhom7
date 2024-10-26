<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['message'])) {
        // Xử lý tin nhắn với server Python
        $url = 'http://127.0.0.1:5001/chatbot';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('message' => $data['message'])));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        $response = curl_exec($ch);
        curl_close($ch);

        $response_data = json_decode($response, true);

        if (isset($response_data['response'])) {
            echo json_encode($response_data);
        } else {
            echo json_encode(array('message' => 'Có lỗi xảy ra khi xử lý phản hồi từ server.'));
        }
    } elseif (isset($data['name']) && isset($data['phone']) && isset($data['address']) && isset($data['email']) && isset($data['room']) && isset($data['area'])) {
        // Nhận dữ liệu JSON từ chatbot.js
        $name = $data['name'];
        $phone = $data['phone'];
        $address = $data['address'];
        $email = $data['email'];
        $room = $data['room'];
        $area = $data['area'];

        // Gọi API Python để xử lý yêu cầu đặt phòng
        $url = 'http://127.0.0.1:5001/booking';
        $booking_data = array(
            'name' => $name,
            'phone' => $phone,
            'address' => $address,
            'email' => $email,
            'room' => $room,
            'area' => $area
        );

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($booking_data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        $response = curl_exec($ch);
        curl_close($ch);

        $response_data = json_decode($response, true);
        if (isset($response_data['message'])) {
            echo json_encode(array('message' => $response_data['message']));
        } else {
            echo json_encode(array('message' => 'Có lỗi xảy ra khi xử lý yêu cầu đặt phòng.'));
        }
    } elseif (isset($data['type']) && $data['type'] === 'room_selection') {
        // Xử lý lựa chọn loại phòng
        $room = $data['message'];
        $url = 'http://127.0.0.1:5001/chatbot';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('message' => 'Bạn đã chọn loại phòng ' . $room . '. Quý khách muốn đặt phòng ở khu vực nào?')));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        $response = curl_exec($ch);
        curl_close($ch);

        $response_data = json_decode($response, true);
        if (isset($response_data['response'])) {
            echo json_encode($response_data);
        } else {
            echo json_encode(array('message' => 'Có lỗi xảy ra khi xử lý yêu cầu.'));
        }
    } elseif (isset($data['type']) && $data['type'] === 'area_selection') {
        // Xử lý lựa chọn khu vực
        $area = $data['message'];
        $url = 'http://127.0.0.1:5001/chatbot';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('message' => 'Bạn đã chọn khu vực ' . $area . '. Quý khách muốn đặt phòng mấy ngày?')));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        $response = curl_exec($ch);
        curl_close($ch);

        $response_data = json_decode($response, true);
        if (isset($response_data['response'])) {
            echo json_encode($response_data);
        } else {
            echo json_encode(array('message' => 'Có lỗi xảy ra khi xử lý yêu cầu.'));
        }
    } elseif (isset($data['type']) && $data['type'] === 'booking_dates') {
        // Xử lý lựa chọn ngày đặt phòng
        $startDate = $data['startDate'];
        $endDate = $data['endDate'];
        $url = 'http://127.0.0.1:5001/chatbot';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('message' => 'Bạn đã chọn ngày đặt phòng từ ' . $startDate . ' đến ' . $endDate . '.')));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        $response = curl_exec($ch);
        curl_close($ch);

        $response_data = json_decode($response, true);
        if (isset($response_data['response'])) {
            echo json_encode($response_data);
        } else {
            echo json_encode(array('message' => 'Có lỗi xảy ra khi xử lý yêu cầu.'));
        }
    } elseif (isset($data['type']) && $data['type'] === 'confirm_booking') {
        // Xử lý xác nhận đặt phòng
        $url = 'http://127.0.0.1:5001/chatbot';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('message' => 'Vui lòng cung cấp thông tin cá nhân để đặt phòng: tên, số điện thoại, địa chỉ, email.')));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        $response = curl_exec($ch);
        curl_close($ch);

        $response_data = json_decode($response, true);
        if (isset($response_data['response'])) {
            echo json_encode($response_data);
        } else {
            echo json_encode(array('message' => 'Có lỗi xảy ra khi xử lý yêu cầu.'));
        }
    } else {
        echo json_encode(array('message' => 'Yêu cầu không hợp lệ.'));
    }
}
?>