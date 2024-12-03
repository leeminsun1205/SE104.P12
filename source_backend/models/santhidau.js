const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cauthu = sequelize.define('Santhidau', {
    MaSan: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenSan: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    DiaChiSan: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    SucChua: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    TieuChuan: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'SANTHIDAU',
    timestamps: false,
});

module.exports = Santhidau;