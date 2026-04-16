const multer = require('multer');

// Sử dụng memoryStorage để giữ file trong RAM thay vì ghi ra ổ cứng.
// Việc này giúp tránh mã độc được lưu vật lý trên Server.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Xác thực an toàn từ Backend: Không tin tưởng Frontend
    // Chỉ chấp nhận Mimetype bắt đầu bằng image/ hoặc video/
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Bé chỉ được gửi ảnh hoặc video thôi nha!'), false);
    }
};

// Giới hạn kích thước file tải lên tối đa 15MB 
// (MongoDB giới hạn 1 document tối đa 16MB, nên ta set 15MB để lưu an toàn)
module.exports = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 }, fileFilter });