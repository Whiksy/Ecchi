const express = require('express');
const router = express.Router();
const MediaController = require('../controllers/MediaController');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');

// Middleware bắt lỗi nếu upload sai file (ví dụ: upload exe, hoặc vượt 50MB)
const uploadMiddleware = (req, res, next) => {
    upload.single('media')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
};

// Định tuyến (Routing) các API
router.post('/upload', uploadMiddleware, MediaController.uploadMedia);
router.get('/media', auth, MediaController.getMediaList); // Lấy danh sách (Bảo mật auth Admin)
router.delete('/media/:id', auth, MediaController.deleteMedia); // Xóa (Bảo mật auth Admin)

router.get('/media/file/:id', auth, MediaController.serveMediaFile); // API để frontend load ảnh/video gốc từ DB ra UI

module.exports = router;