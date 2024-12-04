const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UT_XepHang = sequelize.define('UT_XepHang', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'MuaGiai', 
            key: 'MaMuaGiai',
        },
    },
    MaLoaiUT: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'LoaiUuTien', 
            key: 'MaLoaiUT',
        },
    },
    MucDoUT: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'UT_XEPHANG',
    timestamps: false,
});

module.exports = UT_XepHang;
