const mongoose = require('mongoose');

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Ecchi')
    .then(() => console.log('✅ Đã kết nối MongoDB!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

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
        return await Media.find({}, '-file_data').sort({ created_at: -1 }).lean();
    }

    // Lấy duy nhất 1 file bao gồm cả nội dung Buffer
    async findById(id) {
        return await Media.findById(id).lean();
    }

    // Xóa file khỏi MongoDB
    async delete(id) {
        await Media.findByIdAndDelete(id);
    }
}

module.exports = new MediaModel();