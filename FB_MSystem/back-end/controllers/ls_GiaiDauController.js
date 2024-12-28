const { LichSuGiaiDau, DoiBong, BangXepHang } = require('../models');
const { sequelize } = require('../models'); // Import sequelize instance

const LichSuGiaiDauController = {
    async getByDoiBong(req, res) {
        try {
            const { MaDoiBong } = req.params;
            const lichSu = await LichSuGiaiDau.findAll({
                where: { MaDoiBong },
                include: [
                    { model: DoiBong, as: 'DoiBong' },
                ],
            });
            res.status(200).json(lichSu);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy lịch sử giải đấu của đội bóng.' });
        }
    },

    async update(req, res) {
        try {
            const { MaMuaGiai, MaVongDau } = req.body;

            if (!MaMuaGiai || !MaVongDau) {
                return res.status(400).json({ error: 'MaMuaGiai và MaVongDau là bắt buộc.' });
            }

            // 1. Tính SoLanThamGia cho từng MaDoiBong
            const teamsWithParticipation = await BangXepHang.findAll({
                attributes: [
                    'MaDoiBong',
                    [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('MaMuaGiai'))), 'SoLanThamGia']
                ],
                group: ['MaDoiBong']
            });

            // 2. Tính TongSoTran cho từng MaDoiBong
            const teamsWithTotalMatches = await BangXepHang.findAll({
                attributes: [
                    'MaDoiBong',
                    [sequelize.fn('SUM', sequelize.col('SoTran')), 'TongSoTran']
                ],
                group: ['MaDoiBong']
            });

            // 3. Lấy danh sách top 1, top 2, top 3 từ BangXepHang
            const topTeams = await BangXepHang.findAll({
                attributes: [
                    'MaDoiBong',
                    'MaMuaGiai',
                    'MaVongDau',
                    [sequelize.literal('RANK() OVER (PARTITION BY MaMuaGiai, MaVongDau ORDER BY DiemSo DESC)'), 'Rank']
                ],
                where: { MaMuaGiai, MaVongDau },
                order: [[sequelize.literal('Rank'), 'ASC']],
            });

            if (!topTeams || topTeams.length === 0) {
                return res.status(404).json({ error: 'Không có dữ liệu xếp hạng trong vòng đấu hoặc mùa giải này.' });
            }

            // Kết hợp dữ liệu để cập nhật LichSuGiaiDau
            for (const team of teamsWithParticipation) {
                const { MaDoiBong } = team;
                const SoLanThamGia = team.getDataValue('SoLanThamGia');
                const TongSoTran = teamsWithTotalMatches.find(t => t.MaDoiBong === MaDoiBong)?.getDataValue('TongSoTran') || 0;
                const rank = topTeams.find(t => t.MaDoiBong === MaDoiBong)?.getDataValue('Rank');

                // Tìm hoặc tạo bản ghi LichSuGiaiDau
                const lichSu = await LichSuGiaiDau.findOne({ where: { MaDoiBong } });

                if (lichSu) {
                    // Cập nhật các giá trị
                    await lichSu.update({
                        SoLanThamGia,
                        TongSoTran,
                        SoLanVoDich: rank === 1 ? lichSu.SoLanVoDich + 1 : lichSu.SoLanVoDich,
                        SoLanAQuan: rank === 2 ? lichSu.SoLanAQuan + 1 : lichSu.SoLanAQuan,
                        SoLanHangBa: rank === 3 ? lichSu.SoLanHangBa + 1 : lichSu.SoLanHangBa,
                    });
                } else {
                    // Tạo mới nếu chưa có
                    await LichSuGiaiDau.create({
                        MaDoiBong,
                        SoLanThamGia,
                        TongSoTran,
                        SoLanVoDich: rank === 1 ? 1 : 0,
                        SoLanAQuan: rank === 2 ? 1 : 0,
                        SoLanHangBa: rank === 3 ? 1 : 0,
                    });
                }
            }

            res.status(200).json({ message: 'Cập nhật lịch sử giải đấu thành công!' });
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin lịch sử giải đấu:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật thông tin lịch sử giải đấu.', details: error.message });
        }
    },
};

module.exports = LichSuGiaiDauController;