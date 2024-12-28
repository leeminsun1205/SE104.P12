const { DoiBong, SanThiDau } = require('../models');
const { isDuplicate } = require('../utils/isDuplicate');
const { Op } = require('sequelize'); 
const DoiBongController = {
    async getAll(req, res) {
        try {
            const doiBongs = await DoiBong.findAll({
                include: [
                    {
                        model: SanThiDau,
                        as: 'SanThiDau',
                        attributes: ['MaSan', 'TenSan', 'SucChua', 'TieuChuan'],
                    },
                ],
            });
            const results = doiBongs.map((doiBong) => {
                const { SanThiDau, ...rest } = doiBong.get();
                return {
                    ...rest,
                    MaSan: SanThiDau?.MaSan || null, 
                    TenSan: SanThiDau?.TenSan || null,
                    SucChua: SanThiDau?.SucChua || null,
                    TieuChuan: SanThiDau?.TieuChuan || null,
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
                        attributes: ['MaSan', 'TenSan', 'SucChua', 'DiaChiSan', 'TieuChuan'],
                    },
                ],
            });
            if (!doiBong) return res.status(404).json({ error: 'Không tìm thấy đội bóng.' });
            const doiBongData = doiBong.get();
            const sanThiDau = doiBongData.SanThiDau;
            const { SanThiDau: excludedSanThiDau, ...rest } = doiBongData; 
            const result = {
                ...rest,
                MaSan: sanThiDau?.MaSan || null,
                TenSan: sanThiDau?.TenSan || null,
                TieuChuan: sanThiDau?.TieuChuan || null,
                SucChua: sanThiDau?.SucChua || null,
                DiaChi: sanThiDau?.DiaChiSan || null, 
            };
            res.status(200).json({doiBong: result});
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
            res.status(201).json({doiBong: doiBong});
        } catch (error) {
            console.error('Lỗi khi thêm đội bóng mới:',error);
            res.status(500).json({ error: 'Lỗi khi thêm đội bóng mới.', details: error.message});
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

            // Kiểm tra tên đội bóng (giữ nguyên)
            if (TenDoiBong && TenDoiBong !== doiBong.TenDoiBong) {
                const isDuplicateName = await DoiBong.findOne({ where: { TenDoiBong } });
                if (isDuplicateName) {
                    return res.status(400).json({ error: `Tên đội bóng "${TenDoiBong}" đã tồn tại.` });
                }
            }

            // Kiểm tra sân vận động
            if (MaSan && MaSan !== doiBong.MaSan) {
                // Tìm xem có đội bóng nào khác đang sử dụng sân này không
                const sanDangDuocSuDung = await DoiBong.findOne({
                    where: {
                        MaSan: MaSan,
                        MaDoiBong: { [Op.ne]: id } // Loại trừ đội bóng hiện tại
                    }
                });

                if (sanDangDuocSuDung) {
                    const sanThiDau = await SanThiDau.findByPk(MaSan);
                    return res.status(400).json({ error: `Sân "${sanThiDau.TenSan}" không khả dụng.` });
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
    
            // Kiểm tra các bảng liên quan
            const mgdbCount = await MgDb.count({ where: { MaDoiBong: id } });
            const dbctCount = await DbCt.count({ where: { MaDoiBong: id } });
            const banThangCount = await BanThang.count({ where: { MaDoiBong: id } });
            // const thePhatCount = await ThePhat.count({ where: { MaDoiBong: id } }); // ThePhat không có MaDoiBong
            const tranDauCount = await TranDau.count({
              where: {
                [Op.or]: [
                  { MaDoiBongNha: id },
                  { MaDoiBongKhach: id }
                ]
              }
            });
    
            if (mgdbCount > 0 || dbctCount > 0 || banThangCount > 0 || tranDauCount > 0) {
                return res.status(400).json({
                    error: 'Không thể xóa đội bóng vì tồn tại các liên kết phụ thuộc.',
                    details: {
                        mgDb: mgdbCount > 0,
                        dbCt: dbctCount > 0,
                        banThang: banThangCount > 0,
                        tranDau: tranDauCount > 0,
                    }
                });
            }
    
            await doiBong.destroy();
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi khi xóa đội bóng.', details: error.message });
        }
    },
};

module.exports = DoiBongController;