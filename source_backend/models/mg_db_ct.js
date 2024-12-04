const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MG_DB_CT = sequelize.define('MG_DB_CT', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: "MuaGiai",
            key: "MaMuaGiai",
        }
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: "DoiBong",
            key: "MaDoiBong",
        }
    },
    MaCauThu: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: "CauThu",
            key: "MaCauThu",
        }
    },
}, {
    tableName: 'MG_DB_CT',
    timestamps: false,
});

module.exports = MG_DB_CT;