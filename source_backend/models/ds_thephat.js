const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DsThePhat = sequelize.define('DSThePhat', {
    MaCauThu: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'CauThu',
            key: 'MaCauThu',
        }
    },
    MaVongDau: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'VongDau',
            key: 'MaVongDau',
        }
    },
    SoTheVang: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    SoTheDo: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    TinhTrangThiDau: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    tableName: 'DSTHEPHAT',
    timestamps: false,
});

module.exports = DsThePhat;