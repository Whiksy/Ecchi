const crypto = require('crypto');

const auth = (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Vẫn ưu tiên lấy trên ENV, nếu không có sẽ lấy giá trị dự phòng
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const envPassword = process.env.ADMIN_PASSWORD;

    let isAuthorized = false;

    if (login && password && login === validUsername) {
        // Ưu tiên 1: Kiểm tra mật khẩu plaintext từ biến môi trường (dành cho Render)
        if (envPassword) {
            if (password === envPassword) {
                isAuthorized = true;
            }
        }
        // Ưu tiên 2: Nếu không có biến môi trường, dùng mật khẩu hash dự phòng trong code (an toàn cho GitHub)
        else {
            const validPasswordHash = '905208f53804241a2b911a313d3a95a89759437712304355150a283313c71361';
            const inputPasswordHash = crypto.createHash('sha256').update(password).digest('hex');
            if (inputPasswordHash === validPasswordHash) {
                isAuthorized = true;
            }
        }
    }

    if (isAuthorized) {
        return next();
    }

    res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu.' });
};
module.exports = auth;