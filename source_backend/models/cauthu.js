const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cauthu = sequelize.define('Cauthu', {
    MaCauThu: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenCauThu: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    NgaySinh: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    QuocTich: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    LoaiCauThu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    ViTri: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    ChieuCao: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    CanNang: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    SoAo: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'CAUTHU',
    timestamps: false,
});

module.exports = Cauthu;