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
    },
    SoTranThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoLanVoDich: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoLanAQuan: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoLanHangBa: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'LICHSUGIAIDAU',
    timestamps: false,
});

module.exports = LichSuGiaiDau;
