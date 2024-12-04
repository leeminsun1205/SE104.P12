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
        references: {
            model: "TranDau",
            key: "MaTranDau",
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
    MaLoaiThePhat: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: "LoaiThePhat",
            key: "MaLoaiThePhat",
        }
    },
    ThoiGian: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    LyDo: {
        type: DataTypes.STRING(50), 
        allowNull: true,
    },
}, {
    tableName: 'THEPHAT',
    timestamps: false,
});

module.exports = ThePhat;