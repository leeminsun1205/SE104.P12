const { MuaGiai } = require('../models');
const { isDuplicate } = require('../utils/isDuplicate');
const { isValidRange } = require('../utils/checkDate');

const MuaGiaiController = {
    async getAll(req, res) {
        try {
            const muaGiais = await MuaGiai.findAll();
            res.status(200).json({muaGiai: muaGiais});
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách mùa giải.' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const muaGiai = await MuaGiai.findByPk(id);
            if (!muaGiai) return res.status(404).json({ error: 'Không tìm thấy mùa giải.' });
            res.status(200).json({muaGiai: muaGiai});
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin mùa giải.' });
        }
    },

    async create(req, res) {
        try {
            let { MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc } = req.body;

            if (!MaMuaGiai) {
                const ngayBatDauDate = new Date(NgayBatDau);
                const year = ngayBatDauDate.getFullYear();
                MaMuaGiai = `MG${year}_`;
            }

            if (!isValidRange(NgayBatDau, NgayKetThuc)) {
                return res.status(400).json({ error: 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.' });
            }
            const isDuplicateName = await isDuplicate(MuaGiai, 'TenMuaGiai', TenMuaGiai);
            if (isDuplicateName) {
                return res.status(400).json({ error: `Tên mùa giải "${TenMuaGiai}" đã tồn tại.` });
            }
            const muaGiai = await MuaGiai.create({
                MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc,
            });
            res.status(201).json({muaGiai: muaGiai});
        } catch (error) {
            console.error('Lỗi khi thêm mùa giải:', error);
            res.status(500).json({ error: 'Lỗi khi thêm mùa giải.', details: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const {TenMuaGiai, NgayBatDau, NgayKetThuc } = req.body;
            const muaGiai = await MuaGiai.findByPk(id);
            if (!muaGiai) {
                return res.status(404).json({ error: 'Không tìm thấy mùa giải.' });
            }
            if (TenMuaGiai && TenMuaGiai !== muaGiai.TenMuaGiai) {
                const isDuplicateName = await isDuplicate(MuaGiai, 'TenMuaGiai', TenMuaGiai);
                if (isDuplicateName) {
                    return res.status(400).json({ error: `Tên mùa giải "${TenMuaGiai}" đã tồn tại.` });
                }
            }
            if (NgayBatDau || NgayKetThuc) {
                const start = NgayBatDau || muaGiai.NgayBatDau;
                const end = NgayKetThuc || muaGiai.NgayKetThuc;
                if (!isValidRange(start, end)) {
                    return res.status(400).json({ error: 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.' });
                }
            }
            await muaGiai.update({muaGiai: TenMuaGiai, NgayBatDau, NgayKetThuc });
            res.status(200).json(muaGiai);
        } catch (error) {
            console.error('Lỗi khi cập nhật mùa giải:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật mùa giải.', details: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const muaGiai = await MuaGiai.findByPk(id);
            if (!muaGiai) return res.status(404).json({ error: 'Không tìm thấy mùa giải.' });
            await muaGiai.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi xóa mùa giải.' });
        }
    },
};

module.exports = MuaGiaiController;
