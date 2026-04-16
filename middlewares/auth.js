const auth = (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || '123456';

    if (login && password && login === validUsername && password === validPassword) {
        return next();
    }

    // Chỉ trả về lỗi 401 dạng JSON, không gửi header WWW-Authenticate để tránh popup
    res.status(401).json({ error: 'Yêu cầu xác thực Admin.' });
};
module.exports = auth;