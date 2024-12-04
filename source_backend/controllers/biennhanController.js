const BienNhan = require('../models/biennhan');

const getBienNhan = async (req, res) => {
    try {
        const bienNhanList = await BienNhan.findAll();
        res.status(200).json(bienNhanList);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách biên nhận', details: err.message });
    }
};

const createBienNhan = async (req, res) => {
    try {
        const { MaLePhi, MaDoiBong, SoTien, NgayBatDau, NgayHetHan, NgayThanhToan, TinhTrang } = req.body;

        if (!MaLePhi || !MaDoiBong || !SoTien || !NgayBatDau || !NgayHetHan) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc.' });
        }
        if (new Date(NgayBatDau) >= new Date(NgayHetHan)) {
            return res.status(400).json({ error: 'Ngày bắt đầu phải nhỏ hơn ngày hết hạn.' });
        }

        const newBienNhan = await BienNhan.create({ MaLePhi, MaDoiBong, SoTien, NgayBatDau, NgayHetHan, NgayThanhToan, TinhTrang });
        res.status(201).json(newBienNhan);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo biên nhận mới', details: err.message });
    }
};

const updateBienNhan = async (req, res) => {
    try {
        const { MaLePhi } = req.params; 
        const { MaDoiBong, SoTien, NgayBatDau, NgayHetHan, NgayThanhToan, TinhTrang } = req.body;

        const bienNhan = await BienNhan.findOne({ where: { MaLePhi } });
        if (!bienNhan) {
            return res.status(404).json({ message: `Không tìm thấy biên nhận với mã ${MaLePhi}.` });
        }

        if (NgayBatDau && NgayHetHan && new Date(NgayBatDau) >= new Date(NgayHetHan)) {
            return res.status(400).json({ error: 'Ngày bắt đầu phải nhỏ hơn ngày hết hạn.' });
        }

        const updatedBienNhan = await bienNhan.update({
            MaDoiBong: MaDoiBong || bienNhan.MaDoiBong,
            SoTien: SoTien || bienNhan.SoTien,
            NgayBatDau: NgayBatDau || bienNhan.NgayBatDau,
            NgayHetHan: NgayHetHan || bienNhan.NgayHetHan,
            NgayThanhToan: NgayThanhToan || bienNhan.NgayThanhToan,
            TinhTrang: TinhTrang || bienNhan.TinhTrang,
        });

        res.status(200).json({ message: `Cập nhật biên nhận với mã ${MaLePhi} thành công.`, updatedBienNhan });
    } catch (error) {
        res.status(500).json({ message: 'Không thể cập nhật biên nhận.', error: error.message });
    }
};

const deleteBienNhan = async (req, res) => {
    try {
        const { MaLePhi } = req.params;
        const deleted = await BienNhan.destroy({
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

module.exports = {getBienNhan, createBienNhan, deleteBienNhan, updateBienNhan};
