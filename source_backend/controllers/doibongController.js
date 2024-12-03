const DoiBong = require('../models/doibong');
const San = require('../models/santhidau');

// Lấy danh sách đội bóng
const getDoiBong = async (req, res) => {
    try {
        const doiBongs = await DoiBong.findAll();
        res.status(200).json(doiBongs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể lấy danh sách đội bóng.', error: error.message });
    }
};

// Thêm đội bóng mới
const createDoiBong = async (req, res) => {
    try {
        const { MaDoiBong, TenDoiBong, CoQuanChuQuan, ThanhPhoTrucThuoc, MaSan, HLV, ThongTin, Logo } = req.body;

        // Kiểm tra sân vận động tồn tại
        const san = await San.findOne({ where: { MaSan } });
        if (!san) {
            return res.status(404).json({ message: `Không tìm thấy sân vận động với mã ${MaSan}.` });
        }

        // Thêm đội bóng
        const newDoiBong = await DoiBong.create({
            MaDoiBong,
            TenDoiBong,
            CoQuanChuQuan,
            ThanhPhoTrucThuoc,
            MaSan,
            HLV,
            ThongTin,
            Logo,
        });

        res.status(201).json({ message: 'Thêm đội bóng thành công.', newDoiBong });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể thêm đội bóng.', error: error.message });
    }
};

// Cập nhật thông tin đội bóng
const updateDoiBong = async (req, res) => {
    try {
        const { MaDoiBong } = req.params;
        const { TenDoiBong, CoQuanChuQuan, ThanhPhoTrucThuoc, MaSan, HLV, ThongTin, Logo } = req.body;

        // Tìm đội bóng cần cập nhật
        const doiBong = await DoiBong.findOne({ where: { MaDoiBong } });
        if (!doiBong) {
            return res.status(404).json({ message: `Không tìm thấy đội bóng với mã ${MaDoiBong}.` });
        }

        // Cập nhật thông tin
        doiBong.TenDoiBong = TenDoiBong || doiBong.TenDoiBong;
        doiBong.CoQuanChuQuan = CoQuanChuQuan || doiBong.CoQuanChuQuan;
        doiBong.ThanhPhoTrucThuoc = ThanhPhoTrucThuoc || doiBong.ThanhPhoTrucThuoc;
        doiBong.MaSan = MaSan || doiBong.MaSan;
        doiBong.HLV = HLV || doiBong.HLV;
        doiBong.ThongTin = ThongTin || doiBong.ThongTin;
        doiBong.Logo = Logo || doiBong.Logo;

        await doiBong.save();

        res.status(200).json({ message: `Cập nhật đội bóng với mã ${MaDoiBong} thành công.`, doiBong });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể cập nhật đội bóng.', error: error.message });
    }
};

// Xóa đội bóng
const deleteDoiBong = async (req, res) => {
    try {
        const { MaDoiBong } = req.params;

        // Kiểm tra đội bóng có tồn tại
        const deleted = await DoiBong.destroy({ where: { MaDoiBong } });
        if (!deleted) {
            return res.status(404).json({ message: `Không tìm thấy đội bóng với mã ${MaDoiBong}.` });
        }

        res.status(200).json({ message: `Xóa đội bóng với mã ${MaDoiBong} thành công.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể xóa đội bóng.', error: error.message });
    }
};

module.exports = { getDoiBong, createDoiBong, updateDoiBong, deleteDoiBong };
