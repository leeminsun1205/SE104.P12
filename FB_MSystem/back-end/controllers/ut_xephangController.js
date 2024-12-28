const { UtXepHang, LoaiUuTien } = require('../models');

const UtXepHangController = {
    async getByMuaGiai(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const data = await UtXepHang.findAll({
                where: { MaMuaGiai },
                include: [
                    { model: LoaiUuTien, as: 'LoaiUuTien' },
                ],
                order: [['MucDoUuTien', 'ASC']],  // Sắp xếp theo thứ tự ưu tiên
            });
            res.status(200).json(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách ưu tiên xếp hạng theo mùa giải:', error);
            res.status(500).json({ error: 'Lỗi khi lấy danh sách ưu tiên xếp hạng theo mùa giải.' });
        }
    },

    async updateTieuChi(req, res) {
        try {
            const { MaMuaGiai } = req.params;
            const { tieuChi } = req.body;  // tieuChi sẽ chứa các tiêu chí mới mà người dùng muốn cập nhật

            // Kiểm tra xem tieuChi có tồn tại và có phải là một mảng không
            if (!Array.isArray(tieuChi) || tieuChi.length === 0) {
                return res.status(400).json({ error: 'Danh sách tiêu chí không hợp lệ.' });
            }

            // Lấy danh sách các tiêu chí hiện tại trong mùa giải
            const existingTieuChi = await UtXepHang.findAll({
                where: { MaMuaGiai },
            });

            // Tạo một bản sao của danh sách tiêu chí mới để tiện xử lý
            const newTieuChiMap = new Map();
            for (const { MaLoaiUuTien, MucDoUuTien } of tieuChi) {
                newTieuChiMap.set(MaLoaiUuTien, MucDoUuTien);
            }

            // Hoán đổi các mức độ ưu tiên nếu cần
            for (const currentTieuChi of existingTieuChi) {
                const { MaLoaiUuTien, MucDoUuTien: currentMucDo } = currentTieuChi;
                const newMucDo = newTieuChiMap.get(MaLoaiUuTien);

                if (newMucDo !== undefined && newMucDo !== currentMucDo) {
                    // Kiểm tra xem mức độ ưu tiên mới có trùng với mức độ hiện tại của tiêu chí khác không
                    const conflictTieuChi = existingTieuChi.find(
                        t => t.MucDoUuTien === newMucDo && t.MaLoaiUuTien !== MaLoaiUuTien
                    );

                    if (conflictTieuChi) {
                        // Hoán đổi mức độ ưu tiên giữa hai tiêu chí
                        await UtXepHang.update(
                            { MucDoUuTien: currentMucDo },  // Đổi mức độ ưu tiên cho tiêu chí bị trùng
                            { where: { MaLoaiUuTien: conflictTieuChi.MaLoaiUuTien, MaMuaGiai } }
                        );
                    }

                    // Cập nhật tiêu chí với mức độ ưu tiên mới
                    await UtXepHang.update(
                        { MucDoUuTien: newMucDo },
                        { where: { MaLoaiUuTien, MaMuaGiai } }
                    );
                }
            }

            // Nếu có tiêu chí nào mới thì thêm mới (hoặc cập nhật lại)
            for (const { MaLoaiUuTien, MucDoUuTien } of tieuChi) {
                const existingRecord = await UtXepHang.findOne({
                    where: { MaLoaiUuTien, MaMuaGiai }
                });

                if (!existingRecord) {
                    // Tạo mới tiêu chí nếu chưa tồn tại
                    await UtXepHang.create({
                        MaMuaGiai,
                        MaLoaiUuTien,
                        MucDoUuTien
                    });
                }
            }

            res.status(200).json({ message: 'Cập nhật tiêu chí xếp hạng thành công.' });
        } catch (error) {
            console.error('Lỗi khi cập nhật tiêu chí xếp hạng:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật tiêu chí xếp hạng.' });
        }
    },

};

module.exports = UtXepHangController;