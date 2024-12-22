const { ThamSo } = require('../models');

const ThamSoController = {
    async getAll(req, res) {
        try {
            const thamSos = await ThamSo.findAll({
                attributes: [
                    'SucChuaToiThieu',
                    'TieuChuanToiThieu',
                    'TuoiToiThieu',
                    'TuoiToiDa',
                    'SoLuongCauThuToiThieu',
                    'SoLuongCauThuToiDa',
                    'SoCauThuNgoaiToiDa',
                    'LePhi',
                    'ThoiDiemGhiBanToiDa',
                    'DiemThang',
                    'DiemHoa',
                    'DiemThua'
                ]
            });
            res.status(200).json(thamSos);
        } catch (error) {
            console.error('Chi tiết lỗi:', error); // Log lỗi đầy đủ vào console
            res.status(500).json({ 
                error: 'Lỗi khi lấy danh sách tham số.',
                details: error.message, // Gửi kèm chi tiết lỗi về client (không bắt buộc)
            });
        }
    },

    async update(req, res) {
        try {
            const updates = req.body;
    
            // Tìm bản ghi đầu tiên trong bảng
            const thamSo = await ThamSo.findOne(); // Không cần điều kiện cụ thể vì bảng chỉ có một bản ghi
    
            // Kiểm tra nếu không tìm thấy bản ghi
            if (!thamSo) {
                console.error('Không tìm thấy tham số để cập nhật.');
                return res.status(404).json({ error: 'Không tìm thấy tham số để cập nhật.' });
            }
    
            // Cập nhật bản ghi
            await thamSo.update(updates);
    
            // Lấy lại bản ghi đã cập nhật và trả về
            res.status(200).json(thamSo);
        } catch (error) {
            console.error('Lỗi khi cập nhật tham số:', error); // Log lỗi chi tiết
            res.status(500).json({ error: 'Lỗi khi cập nhật tham số.', details: error.message });
        }
    }
    
    
    
};

module.exports = ThamSoController;
