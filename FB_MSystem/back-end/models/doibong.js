const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const DoiBong = sequelize.define(
    'DoiBong',
    {
        MaDoiBong: {
            type: DataTypes.CHAR(10),
            primaryKey: true,
            allowNull: false,
        },
        TenDoiBong: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        ThanhPhoTrucThuoc: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        MaSan: {
            type: DataTypes.CHAR(10),
            allowNull: false,
            references: {
                model: 'SanThiDau',
                key: 'MaSan',
            },
        },
        TenHLV: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        ThongTin: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        Logo: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    },
    {
        tableName: 'DOIBONG',
        timestamps: false,
        hooks: {
            beforeValidate: async (doiBong) => {
                if (!doiBong.MaDoiBong) {
                    const baseMaDoiBong = `DB_${doiBong.TenDoiBong.split(' ').map(word => word[0].toUpperCase()).join('')}`;

                    const existingCodes = await DoiBong.findAll({
                        where: {
                            MaDoiBong: {
                                [Op.like]: `${baseMaDoiBong}%`,
                            },
                        },
                        attributes: ['MaDoiBong'],
                    });

                    const suffixes = existingCodes.map((code) => {
                        const match = code.MaDoiBong.match(/_(\d+)$/);
                        return match ? parseInt(match[1], 10) : 0;
                    });

                    const nextSuffix = suffixes.length > 0 ? Math.max(...suffixes) + 1 : 1;

                    doiBong.MaDoiBong = suffixes.length > 0 ? `${baseMaDoiBong}_${nextSuffix}` : baseMaDoiBong;
                }
            },
        },
    }
);

module.exports = DoiBong;
