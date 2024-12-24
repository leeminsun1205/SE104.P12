const { ThanhTich, DoiBong, MuaGiai } = require('../models');

const ThanhTichController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const thanhTich = await ThanhTich.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                    { model: MuaGiai, as: 'MuaGiai' },
                ],
            });
            res.status(200).json(thanhTich);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thành tích theo mùa giải.' });
        }
    },

    async getByDoiBong(req, res) {
        try {
            const { MaDoiBong } = req.params;
            const thanhTich = await ThanhTich.findAll({
                where: { MaDoiBong },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                    { model: MuaGiai, as: 'MuaGiai' },
                ],
            });
            res.status(200).json(thanhTich);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thành tích của đội bóng.' });
        }
    },

    async create(req, res) {
        try {
            const { MaDoiBong, MaMuaGiai, SoTranThang, SoTranHoa, SoTranThua, XepHang } = req.body;

            // Tính SoTranDaThiDau
            const SoTranDaThiDau = (SoTranThang || 0) + (SoTranHoa || 0) + (SoTranThua || 0);

            const thanhTich = await ThanhTich.create({
                MaDoiBong, MaMuaGiai, SoTranDaThiDau, SoTranThang, SoTranHoa, SoTranThua, XepHang
            });
            res.status(201).json(thanhTich);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi thêm thành tích mới.' });
        }
    },

    async update(req, res) {
        try {
            const { madoibong, mamuagiai } = req.params;
            const updates = req.body;
            const thanhTich = await ThanhTich.findOne({
                where: {
                    madoibong, // Điều kiện đầu tiên
                    mamuagiai  // Điều kiện thứ hai
                }
            });
            if (!thanhTich) return res.status(404).json({ error: 'Không tìm thấy thành tích.' });

            // Tính toán SoTranDaThiDau nếu có thay đổi liên quan
            const SoTranDaThiDau =
                (updates.SoTranThang ?? thanhTich.SoTranThang) +
                (updates.SoTranHoa ?? thanhTich.SoTranHoa) +
                (updates.SoTranThua ?? thanhTich.SoTranThua);

            await thanhTich.update({
                ...updates,
                SoTranDaThiDau
            });
            res.status(200).json(thanhTich);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin thành tích.' });
        }
    },

    async delete(req, res) {
        try {
            const { madoibong, mamuagiai } = req.params;
            const thanhTich = await ThanhTich.findOne({
                where: {
                    madoibong, // Điều kiện đầu tiên
                    mamuagiai  // Điều kiện thứ hai
                }
            });
            if (!thanhTich) return res.status(404).json({ error: 'Không tìm thấy thông tin thành tích.' });
            await thanhTich.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa thành tích.' });
        }
    },
};

module.exports = ThanhTichController;
