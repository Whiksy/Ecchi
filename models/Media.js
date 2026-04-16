const mongoose = require('mongoose');

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Ecchi', {
    serverSelectionTimeoutMS: 5000 // Báo lỗi ngay sau 5 giây nếu bị tường lửa chặn IP
})
    .then(() => console.log('✅ Đã kết nối MongoDB!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB (Kiểm tra lại Mật khẩu hoặc Network Access):', err.message));

// Định nghĩa Schema
const mediaSchema = new mongoose.Schema({
    sender_name: { type: String, required: true },
    file_name: { type: String, required: true },
    file_type: { type: String, required: true },
    file_data: { type: Buffer, required: true },
    created_at: { type: Date, default: Date.now }
});

const Media = mongoose.model('Media', mediaSchema);

class MediaModel {
    // Lưu file vào MongoDB (Dạng Buffer)
    async create(name, fileName, fileType, fileData) {
        const newMedia = new Media({
            sender_name: name,
            file_name: fileName,
            file_type: fileType,
            file_data: fileData
        });
        const savedMedia = await newMedia.save();
        return savedMedia._id.toString();
    }

    // Lấy danh sách file (Bỏ trường file_data để tránh sập RAM)
    async findAll() {
        const results = await Media.find({}, '-file_data').sort({ created_at: -1 }).lean();
        return results.map(item => ({
            ...item,
            id: item._id.toString() // Trả về thêm trường id để tương thích với giao diện Admin cũ
        }));
    }

    // Lấy duy nhất 1 file bao gồm cả nội dung Buffer
    async findById(id) {
        const doc = await Media.findById(id).lean();
        if (doc && doc.file_data) {
            // Chuyển đổi Binary của MongoDB về đúng định dạng Buffer ảnh/video
            doc.file_data = Buffer.isBuffer(doc.file_data) ? doc.file_data : Buffer.from(doc.file_data.buffer);
        }
        return doc;
    }

    // Xóa file khỏi MongoDB
    async delete(id) {
        await Media.findByIdAndDelete(id);
    }
}

module.exports = new MediaModel();