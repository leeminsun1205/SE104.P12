// controllers/thamSoController.js
const ThamSo = require('../models/ThamSo');

// Lấy danh sách các tham số
const getThamSo = async (req, res) => {
    try {
        const thamSo = await ThamSo.findAll();
        res.status(200).json(thamSo);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách tham số' });
    }
};

// Tạo mới tham số
const createThamSo = async (req, res) => {
    try {
        const { SucChuaToiThieu, TieuChuanToiThieu, TuoiToiThieu, TuoiToiDa, SoLuongCauThuToiThieu, SoLuongCauThuToiDa, SoCauThuNgoaiToiDa, LePhi, ThoiDiemGhiBanToiDa, DiemThang, DiemHoa, DiemThua } = req.body;
        const newThamSo = await ThamSo.create({ SucChuaToiThieu, TieuChuanToiThieu, TuoiToiThieu, TuoiToiDa, SoLuongCauThuToiThieu, SoLuongCauThuToiDa, SoCauThuNgoaiToiDa, LePhi, ThoiDiemGhiBanToiDa, DiemThang, DiemHoa, DiemThua });
        res.status(201).json(newThamSo);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo mới tham số' });
    }
};

// Xóa tham số
const deleteThamSo = async (req, res) => {
    try {
        const { SucChuaToiThieu } = req.params;
        const deleted = await ThamSo.destroy({
            where: { SucChuaToiThieu: SucChuaToiThieu }
        });

        if (deleted) {
            res.status(200).json({ message: `Tham số với sức chứa tối thiểu ${SucChuaToiThieu} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy tham số với sức chứa tối thiểu ${SucChuaToiThieu}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa tham số.', error: error.message });
    }
};

module.exports = { getThamSo, createThamSo, deleteThamSo };
