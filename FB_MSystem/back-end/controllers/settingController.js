const { LoaiBanThang, LoaiThePhat, LoaiUuTien } = require('../models');

const getSettings = async (req, res) => {
    try {
        // Truy vấn dữ liệu từ tất cả các bảng
        const loaiBanThang = await LoaiBanThang.findAll();
        const loaiThePhat = await LoaiThePhat.findAll();
        const loaiUuTien = await LoaiUuTien.findAll();

        // Chuẩn bị kết quả
        const settings = {
            LoaiBanThang: loaiBanThang,
            LoaiThePhat: loaiThePhat,
            LoaiUuTien: loaiUuTien,
        };

        // Trả về kết quả
        res.status(200).json({ settings });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu settings:', error);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu settings.', details: error.message });
    }
};

module.exports = { getSettings };
