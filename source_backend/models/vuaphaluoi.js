const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VuaPhaLuoi = sequelize.define('VuaPhaLuoi', {
    MaCauThu: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'CauThu', 
            key: 'MaCauThu',
        },
    },
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'MuaGiai',
            key: 'MaMuaGiai',
        },
    },
    SoTran: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    SoBanThang: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    tableName: 'VUAPHALUOI',
    timestamps: false,
});

module.exports = VuaPhaLuoi;
