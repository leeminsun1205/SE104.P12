const ThamSo = require('../models/thamso');

const getThamSo = async (req, res) => {
    try {
        const thamsos = await ThamSo.findAll();
        res.status(200).json(thamsos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tham số!', details: error.message });
    }
};

const createThamSo = async (req, res) => {
    try {
        const { TenThamSo, GiaTri } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!TenThamSo || !GiaTri) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        const newThamSo = await ThamSo.create({ TenThamSo, GiaTri });
        res.status(201).json({ message: 'Thêm tham số thành công!', data: newThamSo });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Lỗi khi thêm tham số!', details: error.message });
    }
};

const deleteThamSo = async (req, res) => {
    try {
        const { MaThamSo } = req.params;

        // Xóa tham số
        const deleted = await ThamSo.destroy({ where: { MaThamSo } });
        if (!deleted) {
            return res.status(404).json({ message: `Không tìm thấy tham số với mã ${MaThamSo}!` });
        }

        res.status(200).json({ message: `Xóa tham số với mã ${MaThamSo} thành công!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa tham số!', details: error.message });
    }
};

const updateThamSo = async (req, res) => {
    try {
        const { MaThamSo } = req.params;
        const { TenThamSo, GiaTri } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!TenThamSo && !GiaTri) {
            return res.status(400).json({ message: 'Thiếu thông tin để cập nhật!' });
        }

        // Cập nhật tham số
        const [updatedRows] = await ThamSo.update({ TenThamSo, GiaTri }, { where: { MaThamSo } });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Không tìm thấy tham số với mã ${MaThamSo} để cập nhật!` });
        }

        const updatedThamSo = await ThamSo.findOne({ where: { MaThamSo } });
        res.status(200).json({ message: `Cập nhật tham số với mã ${MaThamSo} thành công!`, data: updatedThamSo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật tham số!', details: error.message });
    }
};

module.exports = { getThamSo, createThamSo, deleteThamSo, updateThamSo };
