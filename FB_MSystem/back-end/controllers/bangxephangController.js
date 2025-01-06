// const { UUID, MACADDR } = require('sequelize');
const { BangXepHang, DoiBong, UtXepHang, ThanhTich, LichSuGiaiDau, MuaGiai, VongDau, TranDau, Sequelize } = require('../models');
// const LoaiUuTien = require('../models/loaiuutien');
// const MuaGiaiController = require('./muaGiaiController');

const BangXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const { sortBy, order } = req.query;
            const utxh = await UtXepHang.findAll({
                where: { MaMuaGiai: MaMuaGiai }
            });

            let sortCriteria = [];
            const validSortColumns = ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'];

            if (!Array.isArray(utxh) || utxh.length === 0) {
                return res.status(400).json({ message: 'Danh sách tiêu chí sắp xếp không hợp lệ.' });
            }

            if (!sortBy) {
                sortCriteria = utxh
                    .filter(criterion => validSortColumns.includes(criterion.MaLoaiUuTien))
                    .sort((a, b) => a.MucDoUuTien - b.MucDoUuTien)
                    .map(criterion => [criterion.MaLoaiUuTien, 'DESC']);
            } else {
                if (!validSortColumns.includes(sortBy)) {
                    return res.status(400).json({ message: `Cột sắp xếp không hợp lệ: ${sortBy}` });
                }
                sortCriteria = [[sortBy, (order || 'DESC').toUpperCase()]];
                const remainingCriteria = utxh
                    .filter(criterion => validSortColumns.includes(criterion.MaLoaiUuTien) && criterion.MaLoaiUuTien !== sortBy)
                    .sort((a, b) => a.MucDoUuTien - b.MucDoUuTien)
                    .map(criterion => [criterion.MaLoaiUuTien, 'DESC']);
                sortCriteria = [...sortCriteria, ...remainingCriteria];
            }

            const bangXepHang = await BangXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                        attributes: ['TenDoiBong'],
                    },
                ],
                attributes: ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'],
                order: sortCriteria,
            });

            if (bangXepHang.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy bảng xếp hạng cho mùa giải này.' });
            }

            // Thêm trường XepHang sau khi sắp xếp
            const bangXepHangWithRank = bangXepHang.map((item, index) => {
                return {
                    ...item.get({ plain: true }),
                    TenDoiBong: item.DoiBong.TenDoiBong,
                    XepHang: index + 1,
                };
            });

            res.status(200).json(bangXepHangWithRank);
        } catch (error) {
            console.error('Lỗi khi truy vấn bảng xếp hạng:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const allSeasons = await MuaGiai.findAll({
                order: [['NgayBatDau', 'ASC']]
            });

            const allBangXepHang = {};

            for (const season of allSeasons) {
                const MaMuaGiai = season.MaMuaGiai;
                const utxh = await UtXepHang.findAll({
                    where: { MaMuaGiai: MaMuaGiai }
                });

                let sortCriteria = [];
                const validSortColumns = ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'];

                if (!Array.isArray(utxh) || utxh.length === 0) {
                    // Sử dụng tiêu chí sắp xếp mặc định nếu không có tiêu chí cụ thể
                    sortCriteria = [['DiemSo', 'DESC'], ['HieuSo', 'DESC']];
                } else {
                    sortCriteria = utxh
                        .filter(criterion => validSortColumns.includes(criterion.MaLoaiUuTien))
                        .sort((a, b) => a.MucDoUuTien - b.MucDoUuTien)
                        .map(criterion => [criterion.MaLoaiUuTien, 'DESC']);
                }

                const bangXepHang = await BangXepHang.findAll({
                    where: { MaMuaGiai },
                    include: [
                        {
                            model: DoiBong,
                            as: 'DoiBong',
                            attributes: ['MaDoiBong', 'TenDoiBong'],
                        },
                    ],
                    attributes: ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'],
                    order: sortCriteria,
                });

                const bangXepHangWithRank = bangXepHang.map((item, index) => ({
                    SoTran: item.SoTran,
                    SoTranThang: item.SoTranThang,
                    SoTranHoa: item.SoTranHoa,
                    SoTranThua: item.SoTranThua,
                    SoBanThang: item.SoBanThang,
                    SoBanThua: item.SoBanThua,
                    DiemSo: item.DiemSo,
                    HieuSo: item.HieuSo,
                    DoiBong: {
                        MaDoiBong: item.DoiBong.MaDoiBong,
                        TenDoiBong: item.DoiBong.TenDoiBong
                    },
                    TenDoiBong: item.DoiBong.TenDoiBong,
                    XepHang: index + 1,
                }));

                allBangXepHang[season.MaMuaGiai] = bangXepHangWithRank;
            }

            res.status(200).json(allBangXepHang);
        } catch (error) {
            console.error('Lỗi khi truy vấn bảng xếp hạng của tất cả mùa giải:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async getTeamPositions(req, res) {
        try {
            const totalWins = await ThanhTich.findAll({
                attributes: [
                    'MaDoiBong',
                    [Sequelize.fn('SUM', Sequelize.col('SoTranThang')), 'TongSoTranThang'],
                ],
                group: ['MaDoiBong'],
                raw: true, // To get plain JSON objects
            });
            console.log(totalWins)
            const totalWinsMap = totalWins.reduce((acc, curr) => {
                acc[curr.MaDoiBong] = curr.TongSoTranThang;
                return acc;
            }, {});

            // Fetch other team statistics from LichSuGiaiDau
            const teamPositions = await LichSuGiaiDau.findAll({
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                        attributes: ['TenDoiBong'],
                    },
                ],
                attributes: ['MaDoiBong', 'SoLanThamGia', 'TongSoTran', 'SoLanVoDich', 'SoLanAQuan', 'SoLanHangBa'],
            });

            const formattedData = teamPositions.map(item => ({
                TenDoiBong: item.DoiBong.TenDoiBong,
                MaDoiBong: item.MaDoiBong, // Important for linking
                SoLanThamGia: item.SoLanThamGia,
                SoLanVoDich: item.SoLanVoDich,
                SoLanAQuan: item.SoLanAQuan,
                SoLanHangBa: item.SoLanHangBa,
                TongSoTranThang: totalWinsMap[item.MaDoiBong] || 0, // Get total wins from the map
            }));

            res.status(200).json({ doiBong: formattedData }); // Changed key to 'teams'
        } catch (error) {
            console.error("Lỗi khi truy vấn thống kê vị trí đội bóng:", error);
            res.status(500).json({ error: error.message });
        }
    },
};

// Hàm cập nhật ThanhTich từ BangXepHang (Consider triggering this on season completion)
const updateThanhTichFromBangXepHang = async (MaMuaGiai) => {
    try {
        // ... (rest of the updateThanhTichFromBangXepHang function remains the same)
        console.log(`=== Bắt đầu cập nhật ThanhTich cho MaMuaGiai=${MaMuaGiai} ===`);

        // Lấy bảng xếp hạng theo mùa giải
        const bangXepHangData = await BangXepHang.findAll({
            where: { MaMuaGiai },
            order: [['DiemSo', 'DESC'], ['HieuSo', 'DESC']],
        });

        console.log(`=== Số đội trong BangXepHang (MaMuaGiai=${MaMuaGiai}): ${bangXepHangData.length} ===`);

        // Cập nhật ThanhTich theo thứ hạng
        let rank = 1;
        for (const bxh of bangXepHangData) {
            const {
                MaDoiBong,
                SoTran,
                SoTranThang,
                SoTranHoa,
                SoTranThua,
            } = bxh;

            console.log(`Đang xử lý đội: MaDoiBong=${MaDoiBong}, Rank=${rank}, DiemSo=${bxh.DiemSo}, HieuSo=${bxh.HieuSo}`);

            // Thêm hoặc cập nhật dữ liệu vào bảng ThanhTich
            await ThanhTich.upsert({
                MaMuaGiai,
                MaDoiBong,
                SoTranDaThiDau: SoTran,
                SoTranThang,
                SoTranHoa,
                SoTranThua,
                XepHang: rank,
            });

            console.log(`Cập nhật thành công ThanhTich: MaDoiBong=${MaDoiBong}, XepHang=${rank}`);
            rank++;
        }

        console.log(`=== Hoàn tất cập nhật ThanhTich cho MaMuaGiai=${MaMuaGiai} ===`);
    } catch (error) {
        console.error("Lỗi khi cập nhật ThanhTich từ BangXepHang:", error);
    }
};

const updateLichSuGiaiDau = async () => {
    try {
        // ... (rest of the updateLichSuGiaiDau function remains the same)
        console.log(`=== Bắt đầu cập nhật LS_GIAIDAU ===`);

        // Truy vấn tính thứ hạng
        const rankingQuery = `
            SELECT
                bxh.MaMuaGiai,
                bxh.MaDoiBong,
                bxh.SoTran,
                bxh.DiemSo,
                bxh.HieuSo,
                (
                    SELECT COUNT(*)
                    FROM BangXepHang bxh_inner
                    WHERE bxh_inner.MaMuaGiai = bxh.MaMuaGiai
                    AND (bxh_inner.DiemSo > bxh.DiemSo OR
                         (bxh_inner.DiemSo = bxh.DiemSo AND bxh_inner.HieuSo > bxh.HieuSo))
                ) + 1 AS Ranking
            FROM BangXepHang bxh
        `;

        const rankings = await BangXepHang.sequelize.query(rankingQuery, { type: Sequelize.QueryTypes.SELECT });
        console.log(`=== Dữ liệu tính thứ hạng: ===`);
        console.log(rankings);

        // Xử lý dữ liệu tổng hợp
        const summaryData = rankings.reduce((acc, curr) => {
            const { MaDoiBong, MaMuaGiai, Ranking, SoTran } = curr;

            if (!acc[MaDoiBong]) {
                acc[MaDoiBong] = {
                    MaDoiBong,
                    SoLanThamGia: new Set(),
                    TongSoTran: 0,
                    SoLanVoDich: 0,
                    SoLanAQuan: 0,
                    SoLanHangBa: 0,
                };
            }

            acc[MaDoiBong].SoLanThamGia.add(MaMuaGiai);
            acc[MaDoiBong].TongSoTran += SoTran;

            if (Ranking === 1) acc[MaDoiBong].SoLanVoDich++;
            if (Ranking === 2) acc[MaDoiBong].SoLanAQuan++;
            if (Ranking === 3) acc[MaDoiBong].SoLanHangBa++;

            return acc;
        }, {});

        console.log(`=== Dữ liệu tổng hợp: ===`);
        console.log(summaryData);

        // Cập nhật bảng LichSuGiaiDau
        for (const MaDoiBong in summaryData) {
            const data = summaryData[MaDoiBong];
            await LichSuGiaiDau.upsert({
                MaDoiBong,
                SoLanThamGia: data.SoLanThamGia.size,
                TongSoTran: data.TongSoTran,
                SoLanVoDich: data.SoLanVoDich,
                SoLanAQuan: data.SoLanAQuan,
                SoLanHangBa: data.SoLanHangBa,
            });
        }

        console.log(`=== Hoàn tất cập nhật LS_GIAIDAU ===`);
    } catch (error) {
        console.error("Lỗi khi cập nhật LS_GIAIDAU:", error);
    }
};

// Hàm kiểm tra trạng thái mùa giải
const checkMuaGiaiHoanThanh = async (MaMuaGiai) => {
    try {
        // ... (rest of the checkMuaGiaiHoanThanh function remains the same)
        const vongDauList = await VongDau.findAll({
            where: { MaMuaGiai },
            attributes: ['MaVongDau'],
        });
        const maVongDauList = vongDauList.map(vd => vd.MaVongDau);

        const incompleteMatches = await TranDau.findOne({
            where: {
                MaVongDau: maVongDauList,
                [Sequelize.Op.or]: [
                    { BanThangDoiNha: null },
                    { BanThangDoiKhach: null },
                    { TinhTrang: true },
                ],
            },
        });

        return !incompleteMatches;
    } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái mùa giải:", error);
        return false;
    }
};

module.exports = BangXepHangController;
