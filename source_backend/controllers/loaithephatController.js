// controllers/loaiThePhatController.js
const LoaiThePhat = require('../models/LoaiThePhat');

// Lấy danh sách loại thẻ phạt
const getLoaiThePhat = async (req, res) => {
    try {
        const loaiThePhats = await LoaiThePhat.findAll();
        res.status(200).json(loaiThePhats);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách loại thẻ phạt' });
    }
};

// Tạo mới loại thẻ phạt
const createLoaiThePhat = async (req, res) => {
    try {
        const { MaLoaiThePhat, TenLoaiThePhat, MoTa } = req.body;
        const newLoaiThePhat = await LoaiThePhat.create({ MaLoaiThePhat, TenLoaiThePhat, MoTa });
        res.status(201).json(newLoaiThePhat);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo mới loại thẻ phạt' });
    }
};

// Xóa loại thẻ phạt
const deleteLoaiThePhat = async (req, res) => {
    try {
        const { MaLoaiThePhat } = req.params;
        const deleted = await LoaiThePhat.destroy({
            where: { MaLoaiThePhat: MaLoaiThePhat }
        });

        if (deleted) {
            res.status(200).json({ message: `Loại thẻ phạt với mã ${MaLoaiThePhat} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy loại thẻ phạt với mã ${MaLoaiThePhat}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa loại thẻ phạt.', error: error.message });
    }
};

module.exports = { getLoaiThePhat, createLoaiThePhat, deleteLoaiThePhat };
