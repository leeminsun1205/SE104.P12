const { MgDb, DoiBong, DbCt, CauThu } = require('../models');
const { updateRanking, validateStadiumConditions, validatePlayerConditions} = require('../services/mg_DbServices')
const MgDbController = {
    // Lấy danh sách đội bóng theo mùa giải và danh sách mã cầu thủ
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const mgDbEntries = await MgDb.findAll({
                where: { MaMuaGiai },
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                        attributes: ['MaDoiBong', 'TenDoiBong', 'MaSan', 'TenHLV', 'ThanhPhoTrucThuoc'],
                    },
                ],
            });

            const doiBongInfoWithCauThuIds = [];

            for (const mgDbEntry of mgDbEntries) {
                const doiBong = mgDbEntry.DoiBong;
                if (doiBong) {
                    const dbCtEntries = await DbCt.findAll({
                        where: { MaDoiBong: doiBong.MaDoiBong },
                        include: [
                            {
                                model: CauThu,
                                as: 'CauThu',
                                attributes: ['MaCauThu'], // Chỉ lấy mã cầu thủ
                            },
                        ],
                    });

                    const cauThuIds = dbCtEntries.map(dbCt => dbCt.CauThu.MaCauThu);

                    doiBongInfoWithCauThuIds.push({
                        MaDoiBong: doiBong.MaDoiBong,
                        TenDoiBong: doiBong.TenDoiBong,
                        MaSan: doiBong.MaSan,
                        maCauThu: cauThuIds,
                    });
                }
            }

            res.status(200).json(doiBongInfoWithCauThuIds);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đội bóng và mã cầu thủ theo mùa giải:", error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách đội bóng và mã cầu thủ theo mùa giải.' });
        }
    },

    async getCauThuByMuaGiaiAndDoiBong(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong } = req.params;

            // Lấy thông tin DoiBong thuộc MuaGiai
            const mgDbEntry = await MgDb.findOne({
                where: { MaMuaGiai, MaDoiBong },
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                    },
                ],
            });

            if (!mgDbEntry || !mgDbEntry.DoiBong) {
                return res.status(404).json({ error: 'Không tìm thấy đội bóng trong mùa giải này.' });
            }
            // Lấy danh sách cầu thủ thuộc DoiBong thông qua DbCt
            const dbCtEntries = await DbCt.findAll({
                where: { MaDoiBong: MaDoiBong },
                include: [
                    {
                        model: CauThu,
                        as: 'CauThu',
                        attributes: [
                            'MaCauThu',
                            'TenCauThu',
                            'NgaySinh',
                            'QuocTich',
                            'LoaiCauThu',
                            'ViTri',
                            'ChieuCao',
                            'CanNang',
                            'SoAo',
                            'TieuSu',
                        ],
                    },
                ],
            });
            const cauThus = dbCtEntries.map(dbCt => ({
                MaMuaGiai: MaMuaGiai,
                MaDoiBong: MaDoiBong,
                TenDoiBong: mgDbEntry.DoiBong.TenDoiBong,
                ...dbCt.CauThu.get(),
            }));

            res.status(200).json({ cauThu: cauThus });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách cầu thủ theo mùa giải và đội bóng:", error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách cầu thủ.' });
        }
    },

    async create(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong } = req.body;

            // Kiểm tra điều kiện sân nhà
            await validateStadiumConditions(MaDoiBong);

            // Kiểm tra điều kiện cầu thủ
            await validatePlayerConditions(MaMuaGiai, MaDoiBong);

            // Kiểm tra liên kết đã tồn tại chưa
            const existingLink = await MgDb.findOne({
                where: { MaMuaGiai, MaDoiBong },
            });

            if (existingLink) {
                return res.status(400).json({ error: 'Liên kết này đã tồn tại.' });
            }

            // Tạo liên kết mới
            const newLink = await MgDb.create({ MaMuaGiai, MaDoiBong });

            // Cập nhật bảng xếp hạng thông qua hàm riêng
            await updateRanking(MaMuaGiai, MaDoiBong);

            res.status(201).json(newLink);
        } catch (error) {
            console.error('Lỗi khi tạo liên kết:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async createMany(req, res) {
        try {
            const { links } = req.body;

            if (!Array.isArray(links) || links.length === 0) {
                return res.status(400).json({ error: 'Danh sách liên kết không hợp lệ.' });
            }

            const createdLinks = [];
            const existingLinks = [];
            const invalidLinks = [];

            for (const link of links) {
                const { MaMuaGiai, MaDoiBong } = link;
                try {
                    // Kiểm tra điều kiện sân nhà
                    await validateStadiumConditions(MaDoiBong);

                    // Kiểm tra điều kiện cầu thủ
                    await validatePlayerConditions(MaMuaGiai, MaDoiBong);

                    // Kiểm tra liên kết đã tồn tại chưa
                    const existingLink = await MgDb.findOne({
                        where: { MaMuaGiai, MaDoiBong },
                    });

                    if (existingLink) {
                        existingLinks.push(link);
                        continue;
                    }

                    // Tạo liên kết mới
                    const newLink = await MgDb.create({ MaMuaGiai, MaDoiBong });
                    createdLinks.push(newLink);
                    // Cập nhật bảng xếp hạng
                    await updateRanking(MaMuaGiai, MaDoiBong);
                } catch (err) {
                    invalidLinks.push({ link, error: err.message });
                }
            }

            res.status(201).json({
                createdLinks,
                existingLinks,
                invalidLinks,
                message: `${createdLinks.length} liên kết mới đã được tạo. ${existingLinks.length} liên kết đã tồn tại. ${invalidLinks.length} liên kết không hợp lệ.`,
            });
        } catch (error) {
            console.error('Lỗi khi tạo nhiều liên kết:', error);
            res.status(500).json({ error: 'Lỗi khi tạo nhiều liên kết.' });
        }
    },

    // Cập nhật liên kết giữa mùa giải và đội bóng
    async update(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong } = req.params; // Liên kết cũ
            const updates = req.body; // Dữ liệu mới
            const link = await MgDb.findOne({
                where: { MaMuaGiai, MaDoiBong },
            });

            if (!link) {
                return res.status(404).json({ error: 'Không tìm thấy liên kết để cập nhật.' });
            }

            // Kiểm tra nếu cần đổi sang liên kết mới (MaMuaGiai, MaDoiBong khác)
            if (
                updates.MaMuaGiai && updates.MaMuaGiai !== MaMuaGiai ||
                updates.MaDoiBong && updates.MaDoiBong !== MaDoiBong
            ) {
                const newLink = await MgDb.findOne({
                    where: {
                        MaMuaGiai: updates.MaMuaGiai || MaMuaGiai,
                        MaDoiBong: updates.MaDoiBong || MaDoiBong,
                    },
                });

                if (newLink) {
                    return res.status(400).json({ error: 'Liên kết mới đã tồn tại.' });
                }
            }

            // Cập nhật liên kết
            await link.update(updates);

            res.status(200).json(link);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi cập nhật liên kết.' });
        }
    },

    // Xóa liên kết giữa mùa giải và đội bóng
    async delete(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong } = req.params;

            const link = await MgDb.findOne({
                where: { MaMuaGiai, MaDoiBong },
            });

            if (!link) {
                return res.status(404).json({ error: 'Không tìm thấy liên kết để xóa.' });
            }

            await link.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Lỗi khi xóa liên kết:', error);
            res.status(500).json({ error: 'Lỗi khi xóa liên kết.' });
        }
    },

    async deleteCauThuFromDoiBongMuaGiai(req, res) {
        try {
            const { MaMuaGiai, MaDoiBong, MaCauThu } = req.params;
    
            // Kiểm tra xem bản ghi DbCt có tồn tại không
            const dbCtRecord = await DbCt.findOne({
                where: { MaDoiBong, MaCauThu },
                include: [{
                    model: DoiBong,
                    as: 'DoiBong',
                    where: { MaDoiBong },
                    include: [{
                        model: MgDb,
                        as: 'CacMuaGiaiThamGia',
                        where: { MaMuaGiai }
                    }]
                }]
            });
            if (!dbCtRecord) {
                return res.status(404).json({ error: 'Không tìm thấy cầu thủ này trong đội ở mùa giải này.' });
            }
    
            await dbCtRecord.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Lỗi khi xóa cầu thủ khỏi đội trong mùa giải:', error);
            res.status(500).json({ error: 'Lỗi khi xóa cầu thủ khỏi đội trong mùa giải.' });
        }
    },
};

module.exports = MgDbController;