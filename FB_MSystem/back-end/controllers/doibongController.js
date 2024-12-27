const { DoiBong, SanThiDau } = require('../models');
const { isDuplicate } = require('../utils/isDuplicate');
const DoiBongController = {
    async getAll(req, res) {
        try {
            const doiBongs = await DoiBong.findAll({
                include: [
                    {
                        model: SanThiDau,
                        as: 'SanThiDau',
                        attributes: ['MaSan', 'TenSan'],  // Lấy cả MaSan và TenSan
                    },
                ],
            });
            const results = doiBongs.map((doiBong) => {
                const { SanThiDau, ...rest } = doiBong.get();
                return {
                    ...rest,
                    TenSan: SanThiDau ? SanThiDau.TenSan : null,  // Sử dụng TenSan đã lấy được
                };
            });
            res.status(200).json({ doiBong: results });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách đội bóng.', details: error.message });
        }
    },
    
    async getById(req, res) {
        try {
            const { id } = req.params;
            const doiBong = await DoiBong.findByPk(id, {
                include: [
                    {
                        model: SanThiDau,
                        as: 'SanThiDau',
                        attributes: ['TenSan'], 
                    },
                ],
            });
            if (!doiBong) return res.status(404).json({ error: 'Không tìm thấy đội bóng.' });
            const { SanThiDau, MaSan, ...rest } = doiBong.get(); 
            const result = {
                ...rest,
                TenSan: SanThiDau ? SanThiDau.TenSan : null,
            };
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin đội bóng.', details: error.message });
        }
    },
    
    async create(req, res) {
        try {
            const { MaDoiBong, TenDoiBong, ThanhPhoTrucThuoc, MaSan, TenHLV, ThongTin} = req.body;
            const isDuplicateName = await isDuplicate(DoiBong, 'TenDoiBong', TenDoiBong);
            if (isDuplicateName) {
                return res.status(400).json({ error: `Tên đội bóng "${TenDoiBong}" đã tồn tại.` });
            }
            const doiBong = await DoiBong.create({
                MaDoiBong, TenDoiBong, ThanhPhoTrucThuoc, MaSan, TenHLV, ThongTin,
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
            const { MaDoiBong, TenDoiBong, ThanhPhoTrucThuoc, MaSan, TenHLV, ThongTin } = req.body;
            const doiBong = await DoiBong.findByPk(id);
            if (!doiBong) {
                return res.status(404).json({ error: 'Không tìm thấy đội bóng.' });
            }
            if (TenDoiBong && TenDoiBong !== doiBong.TenDoiBong) {
                const isDuplicateName = await isDuplicate(DoiBong, 'TenDoiBong', TenDoiBong);
                if (isDuplicateName) {
                    return res.status(400).json({ error: `Tên đội bóng "${TenDoiBong}" đã tồn tại.` });
                }
            }
            await doiBong.update({ MaDoiBong, TenDoiBong, ThanhPhoTrucThuoc, MaSan, TenHLV, ThongTin });
            res.status(200).json(doiBong);
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin đội bóng:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin đội bóng.', details: error.message });
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
