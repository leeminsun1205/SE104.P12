const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const CauThu = sequelize.define(
    'CauThu',
    {
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
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        QuocTich: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        LoaiCauThu: {
            type: DataTypes.BOOLEAN, // true: Trong nước, false: Ngoài nước
            allowNull: false,
        },
        ViTri: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        ChieuCao: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { min: 0 },
        },
        CanNang: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { min: 0 },
        },
        SoAo: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            validate: { min: 1, max: 99 },
        },
        TieuSu: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        AnhCauThu: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    },
    {
        tableName: 'CAUTHU',
        timestamps: false,
        hooks: {
            beforeValidate: async (record) => {
                if (!record.MaCauThu) {
                    record.MaCauThu = await autoCreateCode(CauThu, 'CT', 'MaCauThu', 4);
                }
            },
        },
    }
);

module.exports = CauThu;
