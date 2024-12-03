// controllers/thePhatController.js
const ThePhat = require('../models/ThePhat');

// Lấy danh sách thẻ phạt
const getThePhat = async (req, res) => {
    try {
        const thePhats = await ThePhat.findAll();
        res.status(200).json(thePhats);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách thẻ phạt' });
    }
};

// Tạo mới thẻ phạt
const createThePhat = async (req, res) => {
    try {
        const { MaThePhat, MaTranDau, MaCauThu, MaLoaiThePhat, ThoiGian, LyDo } = req.body;
        const newThePhat = await ThePhat.create({ MaThePhat, MaTranDau, MaCauThu, MaLoaiThePhat, ThoiGian, LyDo });
        res.status(201).json(newThePhat);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo mới thẻ phạt' });
    }
};

// Xóa thẻ phạt
const deleteThePhat = async (req, res) => {
    try {
        const { MaThePhat } = req.params;
        const deleted = await ThePhat.destroy({
            where: { MaThePhat: MaThePhat }
        });

        if (deleted) {
            res.status(200).json({ message: `Thẻ phạt với mã ${MaThePhat} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy thẻ phạt với mã ${MaThePhat}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa thẻ phạt.', error: error.message });
    }
};

module.exports = { getThePhat, createThePhat, deleteThePhat };
