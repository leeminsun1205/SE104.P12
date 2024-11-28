const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loaiuutien = sequelize.define('Loaiuutien', {
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

module.exports = Loaiuutien;
