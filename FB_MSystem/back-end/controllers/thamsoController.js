const { ThamSo } = require('../models');

const ThamSoController = {
    // Lấy tham số (bảng chỉ có một bản ghi)
    async getAll(req, res) {
        try {
            const thamSo = await ThamSo.findOne({
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

            if (!thamSo) {
                return res.status(404).json({ error: 'Không tìm thấy tham số.' });
            }

            res.status(200).json(thamSo);
        } catch (error) {
            console.error('Lỗi khi lấy tham số:', error);
            res.status(500).json({ 
                error: 'Lỗi khi lấy tham số.', 
                details: error.message 
            });
        }
    },

    // Cập nhật tham số
    async update(req, res) {
        try {
            const updates = req.body;

            // Tìm bản ghi đầu tiên trong bảng
            const thamSo = await ThamSo.findOne();

            if (!thamSo) {
                console.error('Không tìm thấy tham số để cập nhật.');
                return res.status(404).json({ error: 'Không tìm thấy tham số để cập nhật.' });
            }

            // Kiểm tra dữ liệu cần cập nhật (chỉ cho phép cập nhật các trường hợp lệ)
            const allowedFields = [
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
            ];

            for (const key of Object.keys(updates)) {
                if (!allowedFields.includes(key)) {
                    return res.status(400).json({ error: `Trường không hợp lệ: ${key}` });
                }
            }

            // Cập nhật bản ghi
            await thamSo.update(updates);

            // Trả về bản ghi đã cập nhật
            res.status(200).json(thamSo);
        } catch (error) {
            console.error('Lỗi khi cập nhật tham số:', error);
            res.status(500).json({ 
                error: 'Lỗi khi cập nhật tham số.', 
                details: error.message 
            });
        }
    },

    async getLePhi(req, res) {
        try {
            const thamSo = await ThamSo.findOne(); // Lấy bản ghi tham số duy nhất
            if (thamSo) {
                res.status(200).json({ lePhi: thamSo.LePhi });
            } else {
                res.status(404).json({ message: 'Không tìm thấy tham số hệ thống.' });
            }
        } catch (error) {
            console.error('Lỗi khi lấy lệ phí:', error);
            res.status(500).json({ error: 'Lỗi khi lấy lệ phí.' });
        }
    },
};

module.exports = ThamSoController;
