const { SanThiDau, ThamSo } = require('../models');
const { isDuplicate } = require('../utils/isDuplicate');

const SanThiDauController = {
    // Lấy danh sách tất cả sân thi đấu
    async getAll(req, res) {
        try {
            const sanThiDaus = await SanThiDau.findAll(); // Lấy toàn bộ sân thi đấu
            res.status(200).json(sanThiDaus); // Trả về danh sách
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách sân thi đấu.' });
        }
    },

    // Lấy thông tin sân thi đấu theo ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const sanThiDau = await SanThiDau.findByPk(id); // Truy vấn sân thi đấu theo ID
            if (!sanThiDau) {
                return res.status(404).json({ error: 'Không tìm thấy sân thi đấu.' });
            }
            res.status(200).json(sanThiDau); // Trả về thông tin sân
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thông tin sân thi đấu.' });
        }
    },

    // Tạo mới sân thi đấu
    async create(req, res) {
        try {
            const { MaSan, TenSan, DiaChiSan, SucChua, TieuChuan } = req.body;

            // Kiểm tra trùng tên sân
            const isDuplicateName = await isDuplicate(SanThiDau, 'TenSan', TenSan);
            if (isDuplicateName) {
                return res.status(400).json({ error: `Tên sân "${TenSan}" đã tồn tại.` });
            }

            // Tạo sân thi đấu mới (bỏ kiểm tra sức chứa và tiêu chuẩn vì kiểm tra tại MG_DB)
            const sanThiDaus = await SanThiDau.create({ MaSan, TenSan, DiaChiSan, SucChua, TieuChuan });
            res.status(201).json(sanThiDaus); // Trả về sân vừa tạo
        } catch (error) {
            console.error('Lỗi khi thêm sân thi đấu mới:', error);
            res.status(500).json({ error: 'Lỗi khi thêm sân thi đấu mới.', details: error.message });
        }
    },

    // Cập nhật thông tin sân thi đấu
    async update(req, res) {
        try {
            const { id } = req.params;
            const { TenSan, DiaChiSan, SucChua, TieuChuan } = req.body;

            // Tìm sân thi đấu theo ID
            const sanThiDaus = await SanThiDau.findByPk(id);
            if (!sanThiDaus) {
                return res.status(404).json({ error: 'Không tìm thấy sân thi đấu.' });
            }

            // Kiểm tra trùng tên nếu tên được thay đổi
            if (TenSan && TenSan !== sanThiDaus.TenSan) {
                const isDuplicateName = await isDuplicate(SanThiDau, 'TenSan', TenSan);
                if (isDuplicateName) {
                    return res.status(400).json({ error: `Tên sân "${TenSan}" đã tồn tại.` });
                }
            }

            // Cập nhật thông tin sân (bỏ kiểm tra sức chứa và tiêu chuẩn vì kiểm tra tại MG_DB)
            await sanThiDaus.update({ TenSan, DiaChiSan, SucChua, TieuChuan });
            res.status(200).json(sanThiDaus); // Trả về sân sau khi cập nhật
        } catch (error) {
            console.error('Lỗi khi cập nhật sân thi đấu:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật sân thi đấu.', details: error.message });
        }
    },

    // Xóa sân thi đấu
    async delete(req, res) {
        try {
            const { id } = req.params;
    
            // Tìm và xóa sân thi đấu
            const sanThiDaus = await SanThiDau.findByPk(id);
            if (!sanThiDaus) return res.status(404).json({ error: 'Không tìm thấy sân thi đấu.' });
    
            // Kiểm tra xem sân có đang được sử dụng bởi đội bóng nào không
            const doiBong = await DoiBong.findOne({ where: { MaSan: id } });
            if (doiBong) {
                return res.status(400).json({ error: 'Sân đang được sử dụng bởi một đội bóng.' });
            }
    
            // Kiểm tra xem sân có đang được sử dụng trong trận đấu nào không
            const tranDau = await TranDau.findOne({ where: { MaSan: id } });
            if (tranDau) {
                return res.status(400).json({ error: 'Sân đang được sử dụng trong một trận đấu.' });
            }
    
            await sanThiDaus.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Lỗi khi xóa sân thi đấu:', error);
            res.status(500).json({
                error: 'Lỗi khi xóa sân thi đấu',
                details: error.message
            });
        }
    },
};

module.exports = SanThiDauController;
