const { Op } = require('sequelize');

// Hàm kiểm tra thuộc tính trùng
const isDuplicate = async (model, field, value) => {
    const existingRecord = await model.findOne({
        where: {
            [field]: {
                [Op.eq]: value, // Tìm giá trị trùng với `value`
            },
        },
    });
    return !!existingRecord; // Trả về true nếu tìm thấy bản ghi trùng
};

module.exports = {
    isDuplicate,
};
