// const { UUID, MACADDR } = require('sequelize');
const { BangXepHang, DoiBong, UtXepHang, ThanhTich, LichSuGiaiDau, MuaGiai, VongDau, TranDau, Sequelize } = require('../models');
// const LoaiUuTien = require('../models/loaiuutien');
// const MuaGiaiController = require('./muaGiaiController');
const { sortByDoiDau } = require('../utils/sort'); // Điều chỉnh đường dẫn nếu cần
const BangXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const { sortBy, order } = req.query;
            const utxh = await UtXepHang.findAll({
                where: { MaMuaGiai: MaMuaGiai }
            });

            let sortCriteria = [['DiemSo', 'DESC']]; // Điểm số luôn là ưu tiên hàng đầu
            const validSortColumns = {
                'LUT01': 'HieuSo',
                'LUT02': 'SoBanThang',
            };
            const doiDauSort = utxh.find(item => item.MaLoaiUuTien === 'LUT03');

            console.log('array: ', utxh);

            if (utxh && utxh.length > 0) {
                const sortedUtxh = utxh.sort((a, b) => b.MucDoUuTien - a.MucDoUuTien);
                for (const item of sortedUtxh) {
                    if (validSortColumns[item.MaLoaiUuTien]) {
                        sortCriteria.push([validSortColumns[item.MaLoaiUuTien], 'DESC']);
                    }
                }
            } else {
                // Mặc định nếu không có UTXH
                sortCriteria.push(['HieuSo', 'DESC']);
                sortCriteria.push(['SoBanThang', 'DESC']);
            }

            // Nếu có sortBy từ query, thêm nó lên đầu (sau DiemSo)
            if (sortBy && validSortColumns[sortBy]) {
                sortCriteria.splice(1, 0, [validSortColumns[sortBy], (order || 'DESC').toUpperCase()]);
                // Loại bỏ các trường trùng lặp nếu có
                sortCriteria = sortCriteria.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t[0] === value[0]
                    ))
                );
            }

            let bangXepHang = await BangXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',
                        attributes: ['MaDoiBong', 'TenDoiBong'],
                    },
                ],
                attributes: ['MaDoiBong', 'SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'],
                order: sortCriteria,
            });

            if (bangXepHang.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy bảng xếp hạng cho mùa giải này.' });
            }

            // Sắp xếp theo đối đầu nếu có ưu tiên LUT03
            if (doiDauSort) {
                bangXepHang = await sortByDoiDau(MaMuaGiai, bangXepHang); // Cách 3: Gọi như một hàm thông thường (khuyến nghị)
            }

            const bangXepHangWithRank = bangXepHang.map((item, index) => {
                return {
                    ...item.get({ plain: true }),
                    TenDoiBong: item.DoiBong.TenDoiBong,
                    MaDoiBong: item.DoiBong.MaDoiBong,
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

                let sortCriteria = [['DiemSo', 'DESC'], ['HieuSo', 'DESC']]; // Default sort
                if (utxh && utxh.length > 0) {
                    const sortedUtxh = utxh.sort((a, b) => a.MucDoUuTien - b.MucDoUuTien);
                    sortCriteria = sortedUtxh.map(item => {
                        if (item.MaLoaiUuTien === 'LUT01') return ['HieuSo', 'DESC'];
                        if (item.MaLoaiUuTien === 'LUT02') return ['SoBanThang', 'DESC'];
                        return null;
                    }).filter(Boolean);
                    sortCriteria.unshift(['DiemSo', 'DESC']); // Ensure DiemSo is first
                }

                const bangXepHang = await BangXepHang.findAll({
                    where: { MaMuaGiai },
                    include: [{ model: DoiBong, as: 'DoiBong', attributes: ['MaDoiBong', 'TenDoiBong'] }],
                    attributes: ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'],
                    order: sortCriteria,
                });

                const bangXepHangWithRank = bangXepHang.map((item, index) => ({
                    ...item.get({ plain: true }),
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
                attributes: ['MaDoiBong', [Sequelize.fn('SUM', Sequelize.col('SoTranThang')), 'TongSoTranThang']],
                group: ['MaDoiBong'],
                raw: true,
            });
            const totalWinsMap = totalWins.reduce((acc, curr) => ({ ...acc, [curr.MaDoiBong]: curr.TongSoTranThang }), {});

            const teamPositions = await LichSuGiaiDau.findAll({
                include: [{ model: DoiBong, as: 'DoiBong', attributes: ['TenDoiBong'] }],
                attributes: ['MaDoiBong', 'SoLanThamGia', 'TongSoTran', 'SoLanVoDich', 'SoLanAQuan', 'SoLanHangBa'],
            });

            const formattedData = teamPositions.map(item => ({
                ...item.get({ plain: true }),
                TenDoiBong: item.DoiBong.TenDoiBong,
                TongSoTranThang: totalWinsMap[item.MaDoiBong] || 0,
            }));

            res.status(200).json({ doiBong: formattedData });
        } catch (error) {
            console.error("Lỗi khi truy vấn thống kê vị trí đội bóng:", error);
            res.status(500).json({ error: error.message });
        }
    },
};

const updateThanhTichFromBangXepHang = async (MaMuaGiai) => {
    try {
        console.log(`=== Bắt đầu cập nhật ThanhTich cho MaMuaGiai=${MaMuaGiai} ===`);
        const bangXepHangData = await BangXepHang.findAll({
            where: { MaMuaGiai },
            order: [['DiemSo', 'DESC'], ['HieuSo', 'DESC']],
        });
        console.log(`=== Số đội trong BangXepHang (MaMuaGiai=${MaMuaGiai}): ${bangXepHangData.length} ===`);

        let rank = 1;
        for (const bxh of bangXepHangData) {
            const { MaDoiBong, SoTran, SoTranThang, SoTranHoa, SoTranThua } = bxh;
            console.log(`Đang xử lý đội: MaDoiBong=${MaDoiBong}, Rank=${rank}, DiemSo=${bxh.DiemSo}, HieuSo=${bxh.HieuSo}`);
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
        console.log(`=== Bắt đầu cập nhật LS_GIAIDAU ===`);
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

        const summaryData = rankings.reduce((acc, curr) => {
            const { MaDoiBong, MaMuaGiai, Ranking, SoTran } = curr;
            acc[MaDoiBong] = acc[MaDoiBong] || { MaDoiBong, SoLanThamGia: new Set(), TongSoTran: 0, SoLanVoDich: 0, SoLanAQuan: 0, SoLanHangBa: 0 };
            acc[MaDoiBong].SoLanThamGia.add(MaMuaGiai);
            acc[MaDoiBong].TongSoTran += SoTran;
            if (Ranking === 1) acc[MaDoiBong].SoLanVoDich++;
            if (Ranking === 2) acc[MaDoiBong].SoLanAQuan++;
            if (Ranking === 3) acc[MaDoiBong].SoLanHangBa++;
            return acc;
        }, {});

        console.log(`=== Dữ liệu tổng hợp: ===`);
        console.log(summaryData);

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

const checkMuaGiaiHoanThanh = async (MaMuaGiai) => {
    try {
        const vongDauList = await VongDau.findAll({ where: { MaMuaGiai }, attributes: ['MaVongDau'] });
        const maVongDauList = vongDauList.map(vd => vd.MaVongDau);
        const incompleteMatches = await TranDau.findOne({
            where: {
                MaVongDau: maVongDauList,
                [Sequelize.Op.or]: [{ BanThangDoiNha: null }, { BanThangDoiKhach: null }, { TinhTrang: true }],
            },
        });
        return !incompleteMatches;
    } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái mùa giải:", error);
        return false;
    }
};

module.exports = BangXepHangController;