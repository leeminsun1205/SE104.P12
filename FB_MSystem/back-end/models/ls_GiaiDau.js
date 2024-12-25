const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LichSuGiaiDau = sequelize.define('LichSuGiaiDau', {
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    SoLanThamGia: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoLanVoDich: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoLanAQuan: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoLanHangBa: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    TongSoTran: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
}, {
    tableName: 'LS_GIAIDAU',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
LichSuGiaiDau.associate = (models) => {
    // Thuộc một đội bóng
    LichSuGiaiDau.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
    });
};

module.exports = LichSuGiaiDau;
