const { VongDau, MG_DB_CT } = require('../models'); 
const { taoVongDau } = require('../services/vongDauService');
const VongDauController = {
    async getAll(req, res) {
        try {
            const vongDaus = await VongDau.findAll();
            res.status(200).json(vongDaus);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách vòng đấu.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const vongDau = await VongDau.findByPk(id);
            if (!vongDau) return res.status(404).json({ error: 'Không tìm thấy vòng đấu.' });
            res.status(200).json(vongDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin vòng đấu.' });
        }
    },

    // async create(req, res) {
    //     try {
    //         const { MaVongDau, MaMuaGiai, LuotDau, SoThuTu, NgayBatDau, NgayKetThuc } = req.body;
    //         const vongDau = await VongDau.create({
    //             MaVongDau, MaMuaGiai, LuotDau, SoThuTu, NgayBatDau, NgayKetThuc,
    //         });
    //         res.status(201).json(vongDau);
    //     } catch (error) {
    //         res.status(500).json({ error: 'Lỗi khi thêm vòng đấu.' });
    //     }
    // },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const vongDau = await VongDau.findByPk(id);
            if (!vongDau) return res.status(404).json({ error: 'Không tìm thấy vòng đấu.' });
            await vongDau.update(updates);
            res.status(200).json(vongDau);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật vòng đấu.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const vongDau = await VongDau.findByPk(id);
            if (!vongDau) return res.status(404).json({ error: 'Không tìm thấy vòng đấu.' });
            await vongDau.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa vòng đấu.' });
        }
    },
    async createByMuaGiai(req, res) {
        try {
            const { maMuaGiai } = req.params;

            // Kiểm tra số đội trong mùa giải
            const doiBongTrongMua = await MG_DB_CT.findAll({
                where: { MaMuaGiai: maMuaGiai },
            });

            if (doiBongTrongMua.length < 2) {
                return res.status(400).json({ error: 'Mùa giải phải có ít nhất 2 đội bóng để tạo vòng đấu.' });
            }

            // Gọi service để tạo vòng đấu
            const result = await taoVongDau(maMuaGiai);

            res.status(201).json(result); // Trả về thông báo và danh sách vòng đấu được tạo
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi tạo vòng đấu cho mùa giải.', details: error.message });
        }
    },
};

module.exports = VongDauController;
