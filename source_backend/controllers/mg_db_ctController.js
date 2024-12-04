const Mg_Db_Ct = require('../models/mg_db_ct');

const getMg_Db_Ct = async (req, res) => {
    try {
        const mg_db_ct = await Mg_Db_Ct.findAll();
        res.status(200).json(mg_db_ct);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách thông tin' });
    }
};

const createMg_Db_Ct = async (req, res) => {
    try {
        const { MaMuaGiai, MaDoiBong, MaCauThu } = req.body;
        const newMg_Db_Ct = await Mg_Db_Ct.create({ MaMuaGiai, MaDoiBong, MaCauThu });
        res.status(201).json(newMg_Db_Ct);
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo thông tin mới' });
    }
};

const deleteMg_Db_Ct = async (req, res) => {
    try {
        const { MaCauThu } = req.params;
        const deleted = await Mg_Db_Ct.destroy({
            where: { MaCauThu: MaCauThu }
        });

        if (deleted) {
            res.status(200).json({ message: `Thông tin với mã mùa giải: ${MaMuaGiai}, mã đội bóng: ${MaDoiBong} mã cầu thủ: ${MaCauThu} đã được xóa.` });
        } else {
            res.status(404).json({ message: `Không tìm thấy thông tin với mã mùa giải: ${MaMuaGiai}, mã đội bóng: ${MaDoiBong} mã cầu thủ: ${MaCauThu}.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa thông tin.', error: error.message });
    }
};

module.exports = { getMg_Db_Ct, createMg_Db_Ct, deleteMg_Db_Ct };