const { DoiBong, SanThiDau } = require('../models');
const { isDuplicate } = require('../utils/isDuplicate');
const DoiBongController = {
    async getAll(req, res) {
        try {
            // Sử dụng include để lấy thông tin từ bảng SanThiDau
            const doiBongs = await DoiBong.findAll({
                include: [
                    {
                        model: SanThiDau,
                        as: 'SanThiDau',
                        attributes: ['TenSan'], // Chỉ lấy cột TenSan
                    },
                ],
            });
    
            // Chuyển đổi dữ liệu trả về để thay MaSan bằng TenSan
            const results = doiBongs.map((doiBong) => {
                const { SanThiDau, MaSan, ...rest } = doiBong.get(); // Loại bỏ MaSan và SanThiDau
                return {
                    ...rest,
                    TenSan: SanThiDau ? SanThiDau.TenSan : null, // Lấy TenSan từ SanThiDau
                };
            });
    
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách đội bóng.', details: error.message });
        }
    },
    
    async getById(req, res) {
        try {
            const { id } = req.params;
    
            // Sử dụng include để lấy thông tin từ bảng SanThiDau
            const doiBong = await DoiBong.findByPk(id, {
                include: [
                    {
                        model: SanThiDau,
                        as: 'SanThiDau',
                        attributes: ['TenSan'], // Chỉ lấy cột TenSan
                    },
                ],
            });
    
            if (!doiBong) return res.status(404).json({ error: 'Không tìm thấy đội bóng.' });
    
            // Chuyển đổi dữ liệu trả về để thay MaSan bằng TenSan
            const { SanThiDau, MaSan, ...rest } = doiBong.get(); // Loại bỏ MaSan và SanThiDau
            const result = {
                ...rest,
                TenSan: SanThiDau ? SanThiDau.TenSan : null, // Lấy TenSan từ SanThiDau
            };
    
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin đội bóng.', details: error.message });
        }
    }
    ,

    async create(req, res) {
        try {
            const { MaDoiBong, TenDoiBong, ThanhPhoTrucThuoc, MaSan, TenHLV, ThongTin, Logo } = req.body;
            const isDuplicateName = await isDuplicate(DoiBong, 'TenDoiBong', TenDoiBong);
            if (isDuplicateName) {
                return res.status(400).json({ error: `Tên đội bóng "${TenDoiBong}" đã tồn tại.` });
            }
            const doiBong = await DoiBong.create({
                MaDoiBong, TenDoiBong, ThanhPhoTrucThuoc, MaSan, TenHLV, ThongTin, Logo,
            });
            res.status(201).json(doiBong);
        } catch (error) {
            console.error('Lỗi khi thêm đội bóng mới:',error);
            res.status(500).json({ error: 'Lỗi khi thêm đội bóng mới.', details: error.massage});
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const doiBong = await DoiBong.findByPk(id);
            if (!doiBong) return res.status(404).json({ error: 'Không tìm thấy đội bóng.' });
            if (updates.TenDoiBong && updates.TenDoiBong !== doiBong.TenDoiBong) {
                const isDuplicateName = await isDuplicate(DoiBong, 'TenDoiBong', updates.TenDoiBong);
                if (isDuplicateName) {
                    return res.status(400).json({ error: `Tên đội bóng "${updates.TenDoiBong}" đã tồn tại.` });
                }
            }
            await doiBong.update(updates);
            res.status(200).json(doiBong);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin đội bóng.' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const doiBong = await DoiBong.findByPk(id);
            if (!doiBong) return res.status(404).json({ error: 'Không tìm thấy đội bóng.' });
            await doiBong.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa đội bóng.' });
        }
    },
};

module.exports = DoiBongController;
