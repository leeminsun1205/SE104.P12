const BangXepHang = require('../models/bangxephang');

const getBangXepHang = async (req, res) => {
    try {
        const bangXepHang = await BangXepHang.findAll();
        res.status(200).json(bangXepHang);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách bảng xếp hạng!', details: error.message });
    }
};

const createBangXepHang = async (req, res) => {
    try {
        const {
            MaMuaGiai,
            MaVongDau,
            MaDoiBong,
            SoTran,
            SoTranThang,
            SoTranHoa,
            SoTranThua,
            SoBanThang,
            SoBanThua,
            HieuSo,
            Diem,
        } = req.body;

        if (
            !MaMuaGiai ||
            !MaVongDau ||
            !MaDoiBong ||
            SoTran === undefined ||
            SoTranThang === undefined ||
            SoTranHoa === undefined ||
            SoTranThua === undefined ||
            SoBanThang === undefined ||
            SoBanThua === undefined ||
            HieuSo === undefined ||
            Diem === undefined
        ) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        const bangXepHang = await BangXepHang.create({
            MaMuaGiai,
            MaVongDau,
            MaDoiBong,
            SoTran,
            SoTranThang,
            SoTranHoa,
            SoTranThua,
            SoBanThang,
            SoBanThua,
            HieuSo,
            Diem,
        });

        res.status(201).json({ message: 'Thêm bảng xếp hạng thành công!', data: bangXepHang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm bảng xếp hạng!', details: error.message });
    }
};

const deleteBangXepHang = async (req, res) => {
    try {
        const { MaMuaGiai, MaVongDau, MaDoiBong } = req.params;

        const result = await BangXepHang.destroy({
            where: { MaMuaGiai, MaVongDau, MaDoiBong },
        });

        if (result === 0) {
            return res.status(404).json({
                message: `Không tìm thấy bảng xếp hạng với mã mùa giải ${MaMuaGiai}, mã vòng đấu ${MaVongDau}, mã đội bóng ${MaDoiBong}!`,
            });
        }

        res.status(200).json({
            message: `Xóa bảng xếp hạng với mã mùa giải ${MaMuaGiai}, mã vòng đấu ${MaVongDau}, mã đội bóng ${MaDoiBong} thành công!`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa bảng xếp hạng!', details: error.message });
    }
};

const updateBangXepHang = async (req, res) => {
    try {
        const { MaMuaGiai, MaVongDau, MaDoiBong } = req.params;
        const {
            SoTran,
            SoTranThang,
            SoTranHoa,
            SoTranThua,
            SoBanThang,
            SoBanThua,
            HieuSo,
            Diem,
        } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (
            SoTran === undefined &&
            SoTranThang === undefined &&
            SoTranHoa === undefined &&
            SoTranThua === undefined &&
            SoBanThang === undefined &&
            SoBanThua === undefined &&
            HieuSo === undefined &&
            Diem === undefined
        ) {
            return res.status(400).json({ message: 'Không có thông tin nào để cập nhật!' });
        }

        // Cập nhật bảng xếp hạng
        const [updatedRows] = await BangXepHang.update(
            {
                SoTran,
                SoTranThang,
                SoTranHoa,
                SoTranThua,
                SoBanThang,
                SoBanThua,
                HieuSo,
                Diem,
            },
            { where: { MaMuaGiai, MaVongDau, MaDoiBong } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({
                message: `Không tìm thấy bảng xếp hạng với mã mùa giải ${MaMuaGiai}, mã vòng đấu ${MaVongDau}, mã đội bóng ${MaDoiBong} để cập nhật!`,
            });
        }

        const updatedBangXepHang = await BangXepHang.findOne({
            where: { MaMuaGiai, MaVongDau, MaDoiBong },
        });

        res.status(200).json({
            message: `Cập nhật bảng xếp hạng với mã mùa giải ${MaMuaGiai}, mã vòng đấu ${MaVongDau}, mã đội bóng ${MaDoiBong} thành công!`,
            data: updatedBangXepHang,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật bảng xếp hạng!', details: error.message });
    }
};

module.exports = {
    getBangXepHang,
    createBangXepHang,
    deleteBangXepHang,
    updateBangXepHang,
};
