const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MuaGiai = sequelize.define('MuaGiai', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenMuaGiai: {
        type: DataTypes.STRING(50),
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
    tableName: 'MUAGIAI',
    timestamps: false,
});

module.exports = MuaGiai;