const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoaiUuTien = sequelize.define('LoaiUuTien', {
    MaLoaiUT: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenLoaiUT: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'LOAIUUTIEN',
    timestamps: false,
});

module.exports = LoaiUuTien;
