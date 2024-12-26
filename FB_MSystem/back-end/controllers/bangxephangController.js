const { UUID } = require('sequelize');
const { BangXepHang, DoiBong, UtXepHang, ThanhTich, LichSuGiaiDau, Sequelize } = require('../models');
const LoaiUuTien = require('../models/loaiuutien');

const BangXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            // Gọi hàm cập nhật ThanhTich
            await updateThanhTichFromBangXepHang(MaMuaGiai);

            // Gọi hàm cập nhật LS_GIAIDAU
            await updateLichSuGiaiDau();
            const utxh = UtXepHang;
            // Lấy danh sách tiêu chí xếp hạng (tầm quan trọng được xác định bởi MucDoUuTien)
            const tieuChiXepHang = await utxh.findAll({
                where: { MaMuaGiai },
                attributes: ['MaLoaiUuTien', 'MucDoUuTien'],
                order: [['MucDoUuTien', 'ASC']],  // Sắp xếp theo tầm quan trọng (MucDoUuTien tăng dần)
            });

            // Nếu không có tiêu chí xếp hạng, trả về lỗi
            if (!tieuChiXepHang || tieuChiXepHang.length === 0) {
                return res.status(400).json({ message: 'Không có tiêu chí xếp hạng cho mùa giải này.' });
            }

            // Tạo mảng các tiêu chí sắp xếp (theo thứ tự giảm dần mặc định)
            const orderBy = tieuChiXepHang.map(tieuChi => [tieuChi.MaLoaiUuTien, 'DESC']);

            // Danh sách các cột hợp lệ trong bảng xếp hạng
            const validSortColumns = ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'];

            // Kiểm tra tính hợp lệ của các tiêu chí
            for (const [column, _] of orderBy) {
                if (!validSortColumns.includes(column)) {
                    return res.status(400).json({ message: `Cột sắp xếp không hợp lệ: ${column}` });
                }
            }

            // Truy vấn bảng xếp hạng
            const bangXepHang = await BangXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    {
                        model: DoiBong,
                        as: 'DoiBong',  // Đảm bảo alias khớp với alias trong định nghĩa BangXepHang
                        attributes: ['TenDoiBong'],  // Chỉ lấy thuộc tính TenDoiBong của DoiBong
                    },
                ],
                attributes: ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'],  // Lấy các thuộc tính từ BangXepHang
                order: orderBy,  // Sắp xếp theo các tiêu chí đã được cấu hình, mặc định giảm dần
            });

            // Kiểm tra nếu không tìm thấy bảng xếp hạng
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
