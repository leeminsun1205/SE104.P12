const { MuaGiai, LoaiUuTien, UtXepHang } = require('../models');
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
                MaMuaGiai = `MG${year}_1`;
            }

            if (!isValidRange(NgayBatDau, NgayKetThuc)) {
                return res.status(400).json({ error: 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.' });
            }
            const isDuplicateName = await isDuplicate(MuaGiai, 'TenMuaGiai', TenMuaGiai);
            if (isDuplicateName) {
                return res.status(400).json({ error: `Tên mùa giải "${TenMuaGiai}" đã tồn tại.` });
            }

            // Sử dụng transaction để đảm bảo tính nhất quán
            const muaGiai = await MuaGiai.sequelize.transaction(async (t) => {
                const newMuaGiai = await MuaGiai.create({
                    MaMuaGiai, TenMuaGiai, NgayBatDau, NgayKetThuc,
                }, { transaction: t });

                // Tạo các bản ghi UT_XEPHANG tương ứng
                await UtXepHang.bulkCreate([
                    { MaMuaGiai: newMuaGiai.MaMuaGiai, MaLoaiUuTien: 'LUT01', MucDoUuTien: 1 },
                    { MaMuaGiai: newMuaGiai.MaMuaGiai, MaLoaiUuTien: 'LUT02', MucDoUuTien: 2 },
                    { MaMuaGiai: newMuaGiai.MaMuaGiai, MaLoaiUuTien: 'LUT03', MucDoUuTien: 3 },
                ], { transaction: t });

                return newMuaGiai;
            });

            res.status(201).json({ muaGiai: muaGiai });
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
            if (!muaGiai) {
                return res.status(404).json({ error: 'Không tìm thấy mùa giải.' });
            }
    
            // Kiểm tra các bảng liên quan
            const mgdbCount = await MgDb.count({ where: { MaMuaGiai: id } });
            const utXepHangCount = await UtXepHang.count({ where: { MaMuaGiai: id } });
            const vongDauCount = await VongDau.count({ where: { MaMuaGiai: id } });
            const bangXepHangCount = await BangXepHang.count({ where: { MaMuaGiai: id } });
            const thanhTichCount = await ThanhTich.count({ where: { MaMuaGiai: id } });
            const vuaPhaLuoiCount = await VuaPhaLuoi.count({ where: { MaMuaGiai: id } });
    
            if (mgdbCount > 0 || utXepHangCount > 0 || vongDauCount > 0 || bangXepHangCount > 0 || thanhTichCount > 0 || vuaPhaLuoiCount > 0) {
                return res.status(400).json({
                    error: 'Không thể xóa mùa giải vì tồn tại các liên kết phụ thuộc.',
                    details: {
                        mgDb: mgdbCount > 0,
                        utXepHang: utXepHangCount > 0,
                        vongDau: vongDauCount > 0,
                        bangXepHang: bangXepHangCount > 0,
                        thanhTich: thanhTichCount > 0,
                        vuaPhaLuoi: vuaPhaLuoiCount > 0,
                    }
                });
            }
    
            await muaGiai.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Lỗi khi xóa mùa giải:', error);
            res.status(500).json({ error: 'Lỗi khi xóa mùa giải.', details: error.message });
        }
    },
};

module.exports = MuaGiaiController;
