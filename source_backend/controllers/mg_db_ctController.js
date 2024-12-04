const MG_DB_CT = require('../models/mg_db_ct');

const getMG_DB_CT = async (req, res) => {
    try {
        const mg_db_ct_list = await MG_DB_CT.findAll();
        res.status(200).json(mg_db_ct_list);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách thông tin.' });
    }
};

const createMG_DB_CT = async (req, res) => {
    try {
        const { MaMuaGiai, MaDoiBong, MaCauThu } = req.body;

        if (!MaMuaGiai || !MaDoiBong || !MaCauThu) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc.' });
        }

        const newMG_DB_CT = await MG_DB_CT.create({ MaMuaGiai, MaDoiBong, MaCauThu });
        res.status(201).json(newMG_DB_CT);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo thông tin mới.', details: err.message });
    }
};

const deleteMG_DB_CT = async (req, res) => {
    try {
        const { MaMuaGiai, MaDoiBong, MaCauThu } = req.params;

        const deleted = await MG_DB_CT.destroy({
            where: { MaMuaGiai, MaDoiBong, MaCauThu }
        });

        if (deleted) {
            res.status(200).json({ message: `Thông tin với mã mùa giải: ${MaMuaGiai}, mã đội bóng: ${MaDoiBong}, mã cầu thủ: ${MaCauThu} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy thông tin với mã mùa giải: ${MaMuaGiai}, mã đội bóng: ${MaDoiBong}, mã cầu thủ: ${MaCauThu}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa thông tin.', error: error.message });
    }
};

module.exports = { getMG_DB_CT, createMG_DB_CT, deleteMG_DB_CT };
