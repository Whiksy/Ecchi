const MediaModel = require('../models/Media');

class MediaController {
    // [POST] Xử lý nhận dữ liệu và đẩy vào DB
    async uploadMedia(req, res) {
        try {
            if (!req.file) return res.status(400).json({ error: 'Không có file hoặc file không hợp lệ.' });
            
            // Bảo mật Backend: Xử lý dữ liệu text đầu vào (Chống XSS - ngăn chặn hacker chèn mã HTML/JS độc hại)
            let rawName = req.body.name || "Unknown";
            const name = rawName.trim()
                .substring(0, 100) // Giới hạn độ dài tên tránh spam
                .replace(/</g, "&lt;") // Mã hóa ký tự HTML
                .replace(/>/g, "&gt;");

            const fileName = req.file.originalname;
            const fileType = req.file.mimetype; // Lưu đúng mimetype (vd: image/png, video/mp4)
            const fileData = req.file.buffer; // Nội dung file nằm trong RAM

            const id = await MediaModel.create(name, fileName, fileType, fileData);
            res.json({ message: 'Thành công!', id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi Server, không thể lưu tệp." });
        }
    }

    // [GET] Trả về danh sách thông tin (Không bao gồm BLOB để tăng tốc độ phản hồi)
    async getMediaList(req, res) {
        try {
            const records = await MediaModel.findAll();
            res.json(records);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi Server, không thể tải danh sách." });
        }
    }

    // [GET] Phục vụ xuất file ảnh/video từ DB trực tiếp sang trình duyệt Client
    async serveMediaFile(req, res) {
        try {
            const id = req.params.id;
            const record = await MediaModel.findById(id);
            
            if (!record || !record.file_data) return res.status(404).json({ error: "Không tìm thấy file" });

            // Set Header Content-Type chuẩn theo file gửi lên để trình duyệt hiểu đó là video hay ảnh
            res.setHeader('Content-Type', record.file_type);
            res.send(record.file_data); // Đẩy nội dung file (BLOB) ra
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi Server, không thể tải file." });
        }
    }

    // [DELETE] Xóa dữ liệu (bản ghi và BLOB) khỏi DB
    async deleteMedia(req, res) {
        try {
            const id = req.params.id;
            await MediaModel.delete(id);
            res.json({ message: "Đã xóa thành công!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi Server, không thể xóa." });
        }
    }
}
module.exports = new MediaController();