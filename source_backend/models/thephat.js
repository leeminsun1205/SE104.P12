const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ThePhat = sequelize.define('ThePhat', {
    MaThePhat: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaTranDau: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    MaCauThu: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    MaLoaiThePhat: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    ThoiGian: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    LyDo: {
        type: DataTypes.STRING(50), 
        allowNull: false,
    },
}, {
    tableName: 'THEPHAT',
    timestamps: false,
});

module.exports = ThePhat;