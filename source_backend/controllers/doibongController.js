const DoiBong = require('../models/doibong');

const getDoiBong = async (req, res) => {
    try {
        const DoiBong = await DoiBong.findAll();
        res.status(200).json(DoiBong);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách đội bóng' });
    }
};

const createDoiBong = async (req, res) => {
    try {
        const { MaDoiBong, TenDoiBong, CoQuanChuQuan, ThanhPhoTrucThuoc, MaSan, HLV, ThongTin, Logo } = req.body;
        const newDoiBong = await DoiBong.create({ MaDoiBong, TenDoiBong, CoQuanChuQuan, ThanhPhoTrucThuoc, MaSan, HLV, ThongTin, Logo });
        res.status(201).json(newDoiBong);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo đội bóng mới' });
    }
};

const deleteDoiBong = async (req, res) => {
    try {
        const { MaDoiBong } = req.params;
        const deleted = await DoiBong.destroy({
            where: { MaDoiBong: MaDoiBong }
        });

        if (deleted) {
            res.status(200).json({ message: `Đội bóng với mã ${MaDoiBong} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy đội bóng với mã ${MaDoiBong}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa đội bóng.', error: error.message });
    }
};

const updateDoiBong = async (req, res) => {
    try {
        const { MaDoiBong } = req.params; 
        const {
            TenDoiBong,
            CoQuanChuQuan,
            ThanhPhoTrucThuoc,
            MaSan,
            HLV,
            ThongTin,
            Logo
        } = req.body;
   
        const doiBong = await DoiBong.findOne({ where: { MaDoiBong: MaDoiBong } });

        if (!doiBong) {
            return res.status(404).json({ message: `Không tìm thấy đội bóng với mã ${MaDoiBong}.` });
        }

        const updatedDoiBong = await doiBong.update({
            TenDoiBong,
            CoQuanChuQuan,
            ThanhPhoTrucThuoc,
            MaSan,
            HLV,
            ThongTin,
            Logo
        });

        res.status(200).json({ message: 'Cập nhật đội bóng thành công.', doiBong: updatedDoiBong });
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật đội bóng.', error: error.message });
    }
};

module.exports = { getDoiBong, createDoiBong, deleteDoiBong, updateDoiBong };