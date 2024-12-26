const { BangXepHang, DoiBong } = require('../models');

const BangXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const { sortBy = 'DiemSo', order = 'DESC' } = req.query;  // Mặc định sắp xếp theo DiemSo giảm dần

            // Danh sách các cột cho phép sắp xếp
            const validSortColumns = ['SoTran', 'SoTranThang', 'SoTranHoa', 'SoTranThua', 'SoBanThang', 'SoBanThua', 'DiemSo', 'HieuSo'];
            
            // Kiểm tra nếu cột sắp xếp không hợp lệ
            if (!validSortColumns.includes(sortBy)) {
                return res.status(400).json({ message: `Cột sắp xếp không hợp lệ: ${sortBy}` });
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
                order: [[sortBy, order.toUpperCase()]],  // Sắp xếp theo tiêu chí và thứ tự do người dùng chọn
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

module.exports = BangXepHangController;
