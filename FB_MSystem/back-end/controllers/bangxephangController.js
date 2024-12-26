const { UUID } = require('sequelize');
const { BangXepHang, DoiBong, UtXepHang, ThanhTich, LichSuGiaiDau, Sequelize } = require('../models');
const LoaiUuTien = require('../models/loaiuutien');

const BangXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const { sortBy, order } = req.query;  // `sortBy` và `order` là lựa chọn từ phía người dùng
            const sortCriteriaBody = req.body;  // Lấy tiêu chí sắp xếp từ body

            let sortCriteria = [];

            // Kiểm tra nếu body không tồn tại hoặc không phải là mảng
            if (!Array.isArray(sortCriteriaBody) || sortCriteriaBody.length === 0) {
                return res.status(400).json({ message: 'Danh sách tiêu chí sắp xếp không hợp lệ.' });
            }

            // Danh sách các cột hợp lệ
            const validSortColumns = ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'];

            // Nếu người dùng không yêu cầu sắp xếp theo cột nào cụ thể
            if (!sortBy) {
                // Lấy tiêu chí mặc định từ body, sắp xếp dựa trên `MucDoUuTien`
                sortCriteria = sortCriteriaBody
                    .filter(criterion => validSortColumns.includes(criterion.MaLoaiUuTien))
                    .sort((a, b) => a.MucDoUuTien - b.MucDoUuTien)
                    .map(criterion => [criterion.MaLoaiUuTien, 'DESC']);  // Mặc định sắp xếp giảm dần

            } else {
                // Người dùng đã chọn cột sắp xếp
                // if (!validSortColumns.includes(sortBy)) {
                //     return res.status(400).json({ message: `Cột sắp xếp không hợp lệ: ${sortBy}` });
                // }

                // Ưu tiên sắp xếp theo lựa chọn người dùng
                sortCriteria = [[sortBy, (order || 'DESC').toUpperCase()]];

                // Thêm các tiêu chí mặc định từ body (không trùng với `sortBy`)
                const remainingCriteria = sortCriteriaBody
                    .filter(criterion => validSortColumns.includes(criterion.MaLoaiUuTien) && criterion.MaLoaiUuTien !== sortBy)
                    .sort((a, b) => a.MucDoUuTien - b.MucDoUuTien)
                    .map(criterion => [criterion.MaLoaiUuTien, 'DESC']);

                sortCriteria = [...sortCriteria, ...remainingCriteria];
            }

            // Truy vấn bảng xếp hạng
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
                order: sortCriteria,  // Sắp xếp theo tiêu chí (mặc định hoặc từ người dùng)
            });

            if (bangXepHang.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy bảng xếp hạng cho mùa giải này.' });
            }

            // Trả về kết quả bảng xếp hạng
            res.status(200).json(bangXepHang);
        } catch (error) {
            console.error('Lỗi khi truy vấn bảng xếp hạng:', error);
            res.status(500).json({ error: error.message });
        }
    },
};

// Hàm cập nhật ThanhTich từ BangXepHang
const updateThanhTichFromBangXepHang = async (MaMuaGiai) => {
    try {
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

module.exports = BangXepHangController;
