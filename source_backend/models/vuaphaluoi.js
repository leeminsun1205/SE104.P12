const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vuaphaluoi = sequelize.define('Vuaphaluoi', {
    MaCauThu: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Cauthu', // Tên bảng cầu thủ, nếu có
            key: 'MaCauThu',
        },
    },
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Muagiai', // Tên bảng mùa giải, nếu có
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

module.exports = Vuaphaluoi;
