const mysql = require('mysql2/promise');

// Tạo kết nối Pool đến Laragon MySQL (Tái sử dụng kết nối giúp tối ưu hiệu suất)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Ecchi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

class MediaModel {
    // Lưu file vào cơ sở dữ liệu (Dạng LONGBLOB)
    async create(name, fileName, fileType, fileData) {
        const [result] = await pool.execute(
            `INSERT INTO media_records (sender_name, file_name, file_type, file_data) VALUES (?, ?, ?, ?)`,
            [name, fileName, fileType, fileData]
        );
        return result.insertId;
    }

    // Lấy danh sách file (CHÚ Ý: Không SELECT trường file_data để tránh sập RAM khi load danh sách)
    async findAll() {
        const [rows] = await pool.execute(
            `SELECT id, sender_name, file_name, file_type, created_at FROM media_records ORDER BY created_at DESC`
        );
        return rows;
    }

    // Lấy duy nhất 1 file bao gồm cả nội dung BLOB (Dùng để hiển thị ảnh/video ra UI)
    async findById(id) {
        const [rows] = await pool.execute(
            `SELECT * FROM media_records WHERE id = ?`, 
            [id]
        );
        return rows[0];
    }

    // Xóa file khỏi Database
    async delete(id) {
        await pool.execute(`DELETE FROM media_records WHERE id = ?`, [id]);
    }
}

module.exports = new MediaModel();