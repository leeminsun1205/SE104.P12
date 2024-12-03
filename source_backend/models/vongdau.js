const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vongdau = sequelize.define('Vongdau', {
    MaVongDau: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    LuotDau: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    SoThuTu: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    NgayBatDau: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    NgayKetThuc: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'VONGDAU',
    timestamps: false,
});

module.exports = Vongdau;