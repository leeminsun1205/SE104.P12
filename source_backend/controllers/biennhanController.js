const Biennhan = require('../models/biennhan');

const getBiennhan = async (req, res) => {
    try {
        const biennhan = await Biennhan.findAll();
        res.status(200).json(biennhan);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách biên nhận' });
    }
};

const createBiennhan = async (req, res) => {
    try {
        const { MaLePhi, MaDoiBong, SoTien, NgayBatDau, NgayHetHan, NgayThanhToan, TinhTrang } = req.body;
        const newBiennhan = await Biennhan.create({ MaLePhi, MaDoiBong, SoTien, NgayBatDau, NgayHetHan, NgayThanhToan, TinhTrang });
        res.status(201).json(newBiennhan);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo biên nhận mới' });
    }
};

const deleteBienhan = async (req, res) => {
    try {
        const { MaLePhi } = req.params;
        const deleted = await Biennhan.destroy({
            where: { MaLePhi: MaLePhi }
        });

        if (deleted) {
            res.status(200).json({ message: `Biên nhận với mã ${MaLePhi} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy biên nhận với mã ${MaLePhi}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa biên nhận.', error: error.message });
    }
};

module.exports = { getBiennhan, createBiennhan, deleteBienhan };