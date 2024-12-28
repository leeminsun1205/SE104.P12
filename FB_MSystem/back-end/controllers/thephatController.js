const { DsThePhat, ThePhat, TranDau, CauThu, LoaiThePhat, DbCt, VongDau, sequelize, DoiBong } = require('../models');

const ThePhatController = {
    async getAll(req, res) {
        try {
            const thePhats = await ThePhat.findAll({
                include: [
                    { model: TranDau, as: 'TranDau' },
                    { model: CauThu, as: 'CauThu' },
                    { model: DoiBong, as: 'DoiBong' },
                    { model: LoaiThePhat, as: 'LoaiThePhat' },
                ],
            });
            res.status(200).json(thePhats);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Lỗi khi lấy danh sách thẻ phạt.' });
        }
    },

    async getByTranDau(req, res) {
        try {
            const { MaTranDau } = req.params;
            const thePhats = await ThePhat.findAll({
                where: { MaTranDau },
                include: [
                    { model: CauThu, as: 'CauThu' },
                    { model: DoiBong, as: 'DoiBong' },
                    { model: LoaiThePhat, as: 'LoaiThePhat' },
                ],
            });
            res.status(200).json(thePhats);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thẻ phạt của trận đấu.' });
        }
    },
    async getByTranDauandID(req, res) {
        try {
            const { MaTranDau, id } = req.params;
            const thePhat = await ThePhat.findOne({
                where: { MaTranDau: MaTranDau, MaThePhat: id },
                include: [
                    { model: CauThu, as: 'CauThu' },
                    { model: DoiBong, as: 'DoiBong' },
                    { model: LoaiThePhat, as: 'LoaiThePhat' },
                ],
            });
    
            if (!thePhat) {
                return res.status(404).json({ message: 'Không tìm thấy thẻ phạt cho trận đấu và ID này.' });
            }
    
            res.status(200).json(thePhat);
        } catch (error) {
            console.error('Lỗi khi lấy thẻ phạt theo MaTranDau và ID:', error);
            res.status(500).json({ error: 'Lỗi khi lấy thẻ phạt.', details: error.message });
        }
    },
    async create(req, res) {
        const { MaThePhat, MaTranDau, MaCauThu, MaLoaiThePhat, ThoiGian, LyDo } = req.body;

        const transaction = await sequelize.transaction();
        try {
            // Lấy MaDoiBong từ bảng DbCt dựa trên MaCauThu
            const dbCt = await DbCt.findOne({
                where: { MaCauThu },
                transaction
            });
            if (!dbCt) {
                return res.status(404).json({ error: 'Không tìm thấy thông tin đội bóng cho cầu thủ này.' });
            }
            const MaDoiBong = dbCt.MaDoiBong;
            // Tạo mới thẻ phạt
            const newThePhat = await ThePhat.create(
                { MaThePhat, MaTranDau, MaCauThu, MaDoiBong, MaLoaiThePhat, ThoiGian, LyDo },
                { transaction }
            );

            // Gọi hàm cập nhật DsThePhat
            await updateDsThePhat(MaCauThu, MaTranDau, transaction);

            await transaction.commit();
            res.status(201).json({ message: 'Thêm thẻ phạt thành công và tự động cập nhật DsThePhat.', newThePhat });
        } catch (error) {
            await transaction.rollback();
            console.error('Lỗi khi thêm thẻ phạt:', error);
            res.status(500).json({ error: 'Lỗi khi thêm thẻ phạt.', details: error.message });
        }
    },
    async putByTranDauandID(req, res) {
        const { MaTranDau, id } = req.params;
        const { MaCauThu, MaLoaiThePhat, ThoiGian, LyDo } = req.body;

        const transaction = await sequelize.transaction();
        try {
            // Tìm thẻ phạt cần cập nhật
            const thePhat = await ThePhat.findOne({
                where: { MaTranDau: MaTranDau, MaThePhat: id },
                transaction
            });

            if (!thePhat) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Không tìm thấy thẻ phạt cho trận đấu và ID này.' });
            }

            // Cập nhật các trường có thể thay đổi
            if (MaCauThu) {
                // Kiểm tra xem MaCauThu có tồn tại không
                const cauThu = await CauThu.findByPk(MaCauThu, { transaction });
                if (!cauThu) {
                    await transaction.rollback();
                    return res.status(400).json({ error: 'Mã cầu thủ không hợp lệ.' });
                }
                thePhat.MaCauThu = MaCauThu;
            }
            if (MaLoaiThePhat) {
                // Kiểm tra xem MaLoaiThePhat có tồn tại không
                const loaiThePhat = await LoaiThePhat.findByPk(MaLoaiThePhat, { transaction });
                if (!loaiThePhat) {
                    await transaction.rollback();
                    return res.status(400).json({ error: 'Mã loại thẻ phạt không hợp lệ.' });
                }
                thePhat.MaLoaiThePhat = MaLoaiThePhat;
            }
            if (ThoiGian !== undefined) {
                thePhat.ThoiGian = ThoiGian;
            }
            if (LyDo !== undefined) {
                thePhat.LyDo = LyDo;
            }

            // Lưu các thay đổi
            await thePhat.save({ transaction });

            // Gọi hàm cập nhật DsThePhat nếu MaCauThu hoặc MaTranDau thay đổi (trong trường hợp này MaTranDau không thay đổi)
            if (MaCauThu && thePhat.MaCauThu !== thePhat.previous('MaCauThu')) {
                await updateDsThePhat(thePhat.MaCauThu, MaTranDau, transaction);
                await updateDsThePhat(thePhat.previous('MaCauThu'), MaTranDau, transaction); // Cập nhật cho cầu thủ cũ
            } else if (!MaCauThu) {
                await updateDsThePhat(thePhat.MaCauThu, MaTranDau, transaction);
            }

            await transaction.commit();

            // Lấy lại thông tin thẻ phạt đã cập nhật để trả về
            const updatedThePhat = await ThePhat.findByPk(id, {
                include: [
                    { model: TranDau, as: 'TranDau' },
                    { model: CauThu, as: 'CauThu' },
                    { model: DoiBong, as: 'DoiBong' },
                    { model: LoaiThePhat, as: 'LoaiThePhat' },
                ],
            });

            res.status(200).json({ message: 'Cập nhật thẻ phạt thành công và tự động cập nhật DsThePhat.', updatedThePhat });

        } catch (error) {
            await transaction.rollback();
            console.error('Lỗi khi cập nhật thẻ phạt:', error);
            res.status(500).json({ error: 'Lỗi khi cập nhật thẻ phạt.', details: error.message });
        }
    },
    async postByTranDau(req, res) {
        const { MaTranDau } = req.params;
        const { MaCauThu, MaLoaiThePhat, ThoiGian, LyDo } = req.body;

        const transaction = await sequelize.transaction();
        try {
            // Kiểm tra xem MaTranDau có tồn tại không
            const tranDau = await TranDau.findByPk(MaTranDau, { transaction });
            if (!tranDau) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Mã trận đấu không hợp lệ.' });
            }

            // Lấy MaDoiBong từ bảng DbCt dựa trên MaCauThu
            const dbCt = await DbCt.findOne({
                where: { MaCauThu },
                transaction
            });
            if (!dbCt) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Không tìm thấy thông tin đội bóng cho cầu thủ này.' });
            }
            const MaDoiBong = dbCt.MaDoiBong;

            // Tạo MaThePhat (có thể tự động tạo hoặc yêu cầu từ request)
            // Ở đây giả sử MaThePhat được cung cấp trong body hoặc tự động tạo
            const MaThePhat = req.body.MaThePhat || `TP${Date.now()}`; // Ví dụ tự tạo

            // Tạo mới thẻ phạt
            const newThePhat = await ThePhat.create(
                { MaThePhat, MaTranDau, MaCauThu, MaDoiBong, MaLoaiThePhat, ThoiGian, LyDo },
                { transaction }
            );

            // Gọi hàm cập nhật DsThePhat
            await updateDsThePhat(MaCauThu, MaTranDau, transaction);

            await transaction.commit();
            res.status(201).json({ message: 'Thêm thẻ phạt thành công và tự động cập nhật DsThePhat.', newThePhat });
        } catch (error) {
            await transaction.rollback();
            console.error('Lỗi khi thêm thẻ phạt:', error);
            res.status(500).json({ error: 'Lỗi khi thêm thẻ phạt.', details: error.message });
        }
    },
    async delete(req, res) {
        const { id } = req.params;

        const transaction = await sequelize.transaction();
        try {
            // Tìm thẻ phạt để lấy thông tin cần thiết
            const thePhat = await ThePhat.findByPk(id, { transaction });
            if (!thePhat) {
                return res.status(404).json({ error: 'Không tìm thấy thẻ phạt với MaThePhat đã cung cấp.' });
            }

            const { MaCauThu, MaTranDau } = thePhat;

            // Xóa thẻ phạt
            await thePhat.destroy({ transaction });

            // Gọi hàm cập nhật DsThePhat
            await updateDsThePhat(MaCauThu, MaTranDau, transaction);

            await transaction.commit();
            res.status(200).json({ message: 'Xóa thẻ phạt thành công và tự động cập nhật DsThePhat.' });
        } catch (error) {
            await transaction.rollback();
            console.error('Lỗi khi xóa thẻ phạt:', error);
            res.status(500).json({ error: 'Lỗi khi xóa thẻ phạt.', details: error.message });
        }
    },
    async deleteByTranDauandID(req, res) {
        const { MaTranDau, id } = req.params;

        const transaction = await sequelize.transaction();
        try {
            // Tìm thẻ phạt theo MaTranDau và MaThePhat
            const thePhat = await ThePhat.findOne({
                where: { MaTranDau: MaTranDau, MaThePhat: id },
                transaction
            });

            if (!thePhat) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Không tìm thấy thẻ phạt với MaTranDau và ID đã cung cấp.' });
            }

            const { MaCauThu } = thePhat;

            // Xóa thẻ phạt
            await thePhat.destroy({ transaction });

            // Gọi hàm cập nhật DsThePhat
            await updateDsThePhat(MaCauThu, MaTranDau, transaction);

            await transaction.commit();
            res.status(200).json({ message: 'Xóa thẻ phạt thành công và tự động cập nhật DsThePhat.' });
        } catch (error) {
            await transaction.rollback();
            console.error('Lỗi khi xóa thẻ phạt:', error);
            res.status(500).json({ error: 'Lỗi khi xóa thẻ phạt.', details: error.message });
        }
    },

};

const updateDsThePhat = async (MaCauThu, MaTranDau, transaction) => {
    try {
        // Lấy thông tin MaVongDau từ TranDau
        const tranDau = await TranDau.findOne({
            where: { MaTranDau },
            attributes: ['MaVongDau'],
            transaction,
        });

        if (!tranDau || !tranDau.MaVongDau) {
            console.error(`Không tìm thấy MaVongDau cho MaTranDau=${MaTranDau}`);
            return; // Thoát nếu không tìm thấy
        }

        const MaVongDau = tranDau.MaVongDau;

        // Truy vấn các thẻ phạt liên quan
        const theCountsQuery = `
            SELECT COUNT(*) as TongSoThe, MaLoaiThePhat
            FROM ThePhat
            WHERE MaCauThu = :MaCauThu
              AND MaTranDau IN (
                SELECT MaTranDau FROM TranDau WHERE MaVongDau = :MaVongDau
              )
              AND MaLoaiThePhat IN ('LTP01', 'LTP02')
            GROUP BY MaLoaiThePhat
        `;

        const theCounts = await sequelize.query(theCountsQuery, {
            replacements: { MaCauThu, MaVongDau },
            type: sequelize.QueryTypes.SELECT,
            transaction,
        });

        let SoTheVang = 0;
        let SoTheDo = 0;

        // Xử lý kết quả truy vấn
        theCounts.forEach((record) => {
            if (record.MaLoaiThePhat === 'LTP01') SoTheVang = parseInt(record.TongSoThe, 10) || 0;
            if (record.MaLoaiThePhat === 'LTP02') SoTheDo = parseInt(record.TongSoThe, 10) || 0;
        });

        // Xác định tình trạng thi đấu
        const TinhTrangThiDau = SoTheVang >= 2 || SoTheDo >= 1 ? 0 : 1;

        // Cập nhật hoặc thêm mới vào DsThePhat
        const [dsThePhat, created] = await DsThePhat.findOrCreate({
            where: { MaCauThu, MaVongDau },
            defaults: { SoTheVang, SoTheDo, TinhTrangThiDau },
            transaction,
        });

        if (!created) {
            await dsThePhat.update({ SoTheVang, SoTheDo, TinhTrangThiDau }, { transaction });
        }

    } catch (error) {
        console.error('Lỗi khi cập nhật DsThePhat:', error.message);
        throw error;
    }
};

module.exports = ThePhatController;
