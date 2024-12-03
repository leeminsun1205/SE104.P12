// controllers/dsthephatController.js
const DSTHEPHAT = require('../models/DSThePhat');

// Lấy danh sách thẻ phạt
const getThePhat = async (req, res) => {
    try {
        const thephats = await DSTHEPHAT.findAll();
        res.status(200).json(thephats);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách thẻ phạt' });
    }
};

// Tạo mới thẻ phạt
const createThePhat = async (req, res) => {
    try {
        const { MaCauThu, MaVongDau, SoTheVang, SoTheDo, TinhTrangThiDau } = req.body;
        const newThePhat = await DSTHEPHAT.create({ MaCauThu, MaVongDau, SoTheVang, SoTheDo, TinhTrangThiDau });
        res.status(201).json(newThePhat);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo mới thẻ phạt' });
    }
};

// Xóa thẻ phạt
const deleteThePhat = async (req, res) => {
    try {
        const { MaCauThu } = req.params;
        const deleted = await DSTHEPHAT.destroy({
            where: { MaCauThu: MaCauThu }
        });

        if (deleted) {
            res.status(200).json({ message: `Thẻ phạt của cầu thủ với mã ${MaCauThu} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy thẻ phạt của cầu thủ với mã ${MaCauThu}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa thẻ phạt.', error: error.message });
    }
};

module.exports = { getThePhat, createThePhat, deleteThePhat };
