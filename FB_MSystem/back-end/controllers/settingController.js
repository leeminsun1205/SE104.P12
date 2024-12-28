const { LoaiBanThang, LoaiThePhat, LoaiUuTien, UtXepHang } = require('../models');

const getSettings = async (req, res) => {
    try {
        // Truy vấn dữ liệu từ tất cả các bảng
        const loaiBanThang = await LoaiBanThang.findAll();
        const loaiThePhat = await LoaiThePhat.findAll();
        const loaiUuTien = await LoaiUuTien.findAll();
        // const utXepHang = await UtXepHang.findAll(); // Thêm dòng này để lấy dữ liệu UtXepHang

        // Chuẩn bị kết quả
        const settings = {
            LoaiBanThang: loaiBanThang,
            LoaiThePhat: loaiThePhat,
            LoaiUuTien: loaiUuTien,
            // Ut_XepHang: utXepHang, // Thêm UtXepHang vào đối tượng settings
        };

        // Trả về kết quả
        res.status(200).json({ settings });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu settings:', error);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu settings.', details: error.message });
    }
};

module.exports = { getSettings };