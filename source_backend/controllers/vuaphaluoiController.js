const VuaPhaLuoi = require('../models/vuaphaluoi');

// Lấy danh sách vua phá lưới
const getVuaPhaLuoi = async (req, res) => {
    try {
        const vuaPhaLuoi = await VuaPhaLuoi.findAll();
        res.status(200).json(vuaPhaLuoi);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách vua phá lưới!', details: error.message });
    }
};

// Thêm vua phá lưới mới
const createVuaPhaLuoi = async (req, res) => {
    try {
        const { MaCauThu, MaMuaGiai, SoTran, SoBanThang } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!MaCauThu || !MaMuaGiai || SoTran === undefined || SoBanThang === undefined) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        const vuaPhaLuoi = await VuaPhaLuoi.create({
            MaCauThu,
            MaMuaGiai,
            SoTran,
            SoBanThang,
        });

        res.status(201).json({ message: 'Thêm vua phá lưới thành công!', data: vuaPhaLuoi });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm vua phá lưới!', details: error.message });
    }
};

// Xóa vua phá lưới
const deleteVuaPhaLuoi = async (req, res) => {
    try {
        const { MaCauThu, MaMuaGiai } = req.params;

        // Xóa vua phá lưới
        const result = await VuaPhaLuoi.destroy({
            where: { MaCauThu, MaMuaGiai },
        });

        if (result === 0) {
            return res.status(404).json({
                message: `Không tìm thấy vua phá lưới với mã cầu thủ ${MaCauThu} và mã mùa giải ${MaMuaGiai}!`,
            });
        }

        res.status(200).json({
            message: `Xóa vua phá lưới với mã cầu thủ ${MaCauThu} và mã mùa giải ${MaMuaGiai} thành công!`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa vua phá lưới!', details: error.message });
    }
};

// Cập nhật thông tin vua phá lưới
const updateVuaPhaLuoi = async (req, res) => {
    try {
        const { MaCauThu, MaMuaGiai } = req.params;
        const { SoTran, SoBanThang } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (SoTran === undefined && SoBanThang === undefined) {
            return res.status(400).json({ message: 'Không có thông tin nào để cập nhật!' });
        }

        // Cập nhật vua phá lưới
        const [updatedRows] = await VuaPhaLuoi.update(
            { SoTran, SoBanThang },
            { where: { MaCauThu, MaMuaGiai } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({
                message: `Không tìm thấy vua phá lưới với mã cầu thủ ${MaCauThu} và mã mùa giải ${MaMuaGiai} để cập nhật!`,
            });
        }

        const updatedVuaPhaLuoi = await VuaPhaLuoi.findOne({
            where: { MaCauThu, MaMuaGiai },
        });

        res.status(200).json({
            message: `Cập nhật vua phá lưới với mã cầu thủ ${MaCauThu} và mã mùa giải ${MaMuaGiai} thành công!`,
            data: updatedVuaPhaLuoi,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật vua phá lưới!', details: error.message });
    }
};

module.exports = {
    getVuaPhaLuoi,
    createVuaPhaLuoi,
    deleteVuaPhaLuoi,
    updateVuaPhaLuoi,
};
