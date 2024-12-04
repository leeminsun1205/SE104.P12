const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CauThu = sequelize.define('CauThu', {
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
    TieuSu: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    AnhCauThu: {
        type: DataTypes.STRING(100),
        allowNull: true,
    }
}, {
    tableName: 'CAUTHU',
    timestamps: false,
});

module.exports = CauThu;