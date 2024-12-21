const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SanThiDau = sequelize.define('SanThiDau', {
    MaSan: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenSan: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    DiaChiSan: {
        type: DataTypes.STRING(80),
        allowNull: false,
    },
    SucChua: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 }, // Sức chứa phải lớn hơn 0
    },
    TieuChuan: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 }, // Tiêu chuẩn từ 1 đến 5 sao
    },
}, {
    tableName: 'SANTHIDAU',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
SanThiDau.associate = (models) => {
    // Một sân thi đấu có thể được sử dụng trong nhiều trận đấu
    SanThiDau.hasMany(models.TranDau, {
        foreignKey: 'MaSan',
        as: 'TranDau',
        onDelete: 'SET NULL', // Nếu sân bị xóa, để NULL thay vì xóa trận đấu
        onUpdate: 'CASCADE',
    });

    // Một sân thi đấu có thể thuộc nhiều đội bóng
    SanThiDau.hasMany(models.DoiBong, {
        foreignKey: 'MaSan',
        as: 'DoiBong',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    });
};

module.exports = SanThiDau;
