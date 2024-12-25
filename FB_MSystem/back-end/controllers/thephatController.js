const { DsThePhat, ThePhat, TranDau, CauThu, LoaiThePhat, VongDau, sequelize } = require('../models');

const ThePhatController = {
    async getAll(req, res) {
        try {
            const thePhats = await ThePhat.findAll({
                include: [
                    { model: TranDau, as: 'TranDau' },
                    { model: CauThu, as: 'CauThu' },
                    { model: LoaiThePhat, as: 'LoaiThePhat' },
                ],
            });
            res.status(200).json(thePhats);
        } catch (error) {
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
                    { model: LoaiThePhat, as: 'LoaiThePhat' },
                ],
            });
            res.status(200).json(thePhats);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi lấy thẻ phạt của trận đấu.' });
        }
    },

    async create(req, res) {
        const { MaThePhat, MaTranDau, MaCauThu, MaLoaiThePhat, ThoiGian, LyDo } = req.body;

        const transaction = await sequelize.transaction();
        try {
            // Tạo mới thẻ phạt
            const newThePhat = await ThePhat.create(
                { MaThePhat, MaTranDau, MaCauThu, MaLoaiThePhat, ThoiGian, LyDo },
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

        console.log(`Cập nhật DsThePhat thành công: MaCauThu=${MaCauThu}, MaVongDau=${MaVongDau}, SoTheVang=${SoTheVang}, SoTheDo=${SoTheDo}, TinhTrangThiDau=${TinhTrangThiDau}`);
    } catch (error) {
        console.error('Lỗi khi cập nhật DsThePhat:', error.message);
        throw error;
    }
};

module.exports = ThePhatController;
