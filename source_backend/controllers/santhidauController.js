const Santhidau = require('../models/santhidau');

const getSanthidau = async (req, res) => {
    try {
        const santhidau = await Santhidau.findAll();
        res.status(200).json(santhidau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách sân thi đấu' });
    }
};

const createSanthidau = async (req, res) => {
    try {
        const { MaSan, TenSan, DiaChiSan, SucChua, TieuChuan } = req.body;
        const newSanthidau = await Santhidau.create({ MaSan, TenSan, DiaChiSan, SucChua, TieuChuan });
        res.status(201).json(newSanthidau);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo sân thi đấu mới' });
    }
};

const deleteSanthidau = async (req, res) => {
    try {
        const { MaSan } = req.params;
        const deleted = await Santhidau.destroy({
            where: { MaSan: MaSan }
        });

        if (deleted) {
            res.status(200).json({ message: `Sân với mã ${MaSan} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy sân thi đấu với mã ${MaSan}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sân thi đấu.', error: error.message });
    }
};

module.exports = { getSanthidau, createSanthidau, deleteSanthidau };