require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Khai báo đường dẫn chuẩn đến file (Đã cập nhật lại dựa trên cấu trúc bạn cung cấp)
const apiRoutes = require('./middlewares/api');
const authMiddleware = require('./middlewares/auth');

const app = express();
const port = process.env.PORT || 3000;

// Giới hạn spam request
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Tối đa 100 requests mỗi IP
    message: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau!"
});

// Middleware bảo mật và hỗ trợ
app.use(helmet({
    contentSecurityPolicy: false, // Tắt CSP để ảnh từ Giphy/Tenor hiển thị bình thường
}));
app.use(limiter);
app.use(express.json());

// Mở thư mục tĩnh
app.use(express.static(path.join(__dirname, 'Views')));

// Đăng ký Routes API 
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
    console.log(`🔗 Link: http://localhost:${port}`);
});