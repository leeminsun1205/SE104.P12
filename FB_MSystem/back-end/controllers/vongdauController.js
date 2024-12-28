const { VongDau } = require('../models'); 
const { autoSchedule } = require('../services/autoSchedule');
const VongDauController = {
    async getByMuaGiai(req, res) {
        try {
            const { maMuaGiai } = req.params;
            const vongDaus = await VongDau.findAll({
                where: { maMuaGiai: maMuaGiai },
            });
    
            if (vongDaus.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy vòng đấu nào cho mùa giải này.' });
            }
    
            const results = vongDaus.map((vongDau) => {
                const { MaVongDau, ...rest } = vongDau.get();
                const TenVongDau = MaVongDau.split('VD').pop(); // Trích xuất "12" từ "MG2025_1VD12"
                return { ...rest, MaVongDau, TenVongDau };
            });
    
            res.status(200).json({ vongDau: results });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách vòng đấu theo mùa giải.', details: error.message });
        }
    },
    
    async getAll(req, res) {
        try {
            const vongDaus = await VongDau.findAll();
    
            const results = vongDaus.map((vongDau) => {
                const { MaVongDau, ...rest } = vongDau.get();
                const TenVongDau = MaVongDau.split('VD').pop(); // Trích xuất "12" từ "MG2025_1VD12"
                return { ...rest, MaVongDau, TenVongDau };
            });
    
            res.status(200).json({ vongDau: results });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách vòng đấu.', details: error.message });
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
    
            // Kiểm tra xem có trận đấu nào thuộc vòng đấu này không
            const tranDauCount = await TranDau.count({ where: { MaVongDau: id } });
            if (tranDauCount > 0) {
                return res.status(400).json({ error: 'Không thể xóa vòng đấu vì có trận đấu thuộc vòng đấu này.' });
            }
    
            await vongDau.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa vòng đấu.' });
        }
    },
    
    async createByMuaGiai(req, res) {
        try {
            const { maMuaGiai } = req.params;

            // Gọi service để tạo vòng đấu và lịch thi đấu
            const { vongDauData, tranDauData } = await autoSchedule(maMuaGiai);

            res.status(201).json({
                message: `Đã tạo ${vongDauData.length} vòng đấu và ${tranDauData.length} trận đấu cho mùa giải ${maMuaGiai}.`,
                vongDauData,
                tranDauData,
            });
        } catch (error) {
            console.error("Lỗi", error);
            res.status(500).json({
                error: 'Lỗi khi tạo vòng đấu và lịch thi đấu cho mùa giải.',
                details: error.message,
            });
        }
    },
    async updateByMuaGiai(req, res) {
        try {
            const { maMuaGiai, id } = req.params; // Lấy mã mùa giải và ID vòng đấu từ URL
            const updates = req.body; // Thông tin cập nhật từ request body
            const vongDau = await VongDau.findOne({
                where: { MaMuaGiai: maMuaGiai, MaVongDau: id },
            });
            
            if (!vongDau) {
                return res.status(404).json({ error: 'Không tìm thấy vòng đấu trong mùa giải.' });
            }

            // Cập nhật vòng đấu
            await vongDau.update(updates);
            res.status(200).json({
                message: 'Vòng đấu đã được cập nhật thành công.',
                vongDau,
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật vòng đấu:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật vòng đấu.', details: error.message });
        }
    }
    
};


module.exports = VongDauController;
