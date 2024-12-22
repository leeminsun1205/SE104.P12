const { Op } = require('sequelize');

// Hàm tìm mã trống gần nhất với padding length
const autoCreateCode = async (model, prefix, field, length = 3) => {
    // Lấy tất cả các mã hiện có từ cơ sở dữ liệu
    const existingCodes = await model.findAll({
        where: {
            [field]: {
                [Op.like]: `${prefix}%`,
            },
        },
        attributes: [field],
        raw: true, // Trả về kết quả thô
    });

    // Trích xuất phần số từ mã
    const suffixes = existingCodes.map((item) => {
        const match = item[field].match(new RegExp(`${prefix}(\\d+)$`));
        return match ? parseInt(match[1], 10) : null;
    }).filter((num) => num !== null); // Loại bỏ null nếu mã không khớp

    // Sắp xếp các phần số tăng dần
    suffixes.sort((a, b) => a - b);

    // Tìm mã trống nhỏ nhất
    for (let i = 1; i <= suffixes.length + 1; i++) {
        if (!suffixes.includes(i)) {
            // Trả về mã với tiền tố và padding length
            return `${prefix}${String(i).padStart(length, '0')}`;
        }
    }
};

module.exports = {
    autoCreateCode,
};