const { taoTranDau } = require('../services/matchService');

async function createMatchesBySeason(req, res) {
    try {
        const { maMuaGiai } = req.params;

        if (!maMuaGiai) {
            return res.status(400).json({ error: 'Thiếu mã mùa giải trong yêu cầu.' });
        }

        const tranDauData = await taoTranDau(maMuaGiai);

        res.status(201).json({
            message: `Đã tạo ${tranDauData.length} trận đấu cho mùa giải ${maMuaGiai}.`,
            data: tranDauData,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Lỗi khi tạo trận đấu.',
            details: error.message,
        });
    }
}

module.exports = { createMatchesBySeason };
