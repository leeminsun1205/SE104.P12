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
            type: DataTypes.BOOLEAN, // 1: Trong nước, 0: Ngoài nước
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
            beforeValidate: async (cauThu) => {
                if (!cauThu.MaCauThu) {
                    const existingCodes = await CauThu.findAll({
                        where: {
                            MaCauThu: {
                                [Op.like]: 'CT%',
                            },
                        },
                        attributes: ['MaCauThu'],
                    });

                    const suffixes = existingCodes.map((code) => {
                        const match = code.MaCauThu.match(/CT(\d+)$/);
                        return match ? parseInt(match[1], 10) : 0;
                    });

                    const nextSuffix = suffixes.length > 0 ? Math.max(...suffixes) + 1 : 1;

                    cauThu.MaCauThu = `CT${String(nextSuffix).padStart(3, '0')}`; // Định dạng CT001, CT002, ...
                }
            },
        },
    }
);

module.exports = CauThu;
