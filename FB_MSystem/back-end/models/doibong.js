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
    },
    {
        tableName: 'DOIBONG',
        timestamps: false,
        hooks: {
            beforeValidate: async (record) => {
                if (!record.MaDoiBong) {
                    record.MaDoiBong = await autoCreateCode(DoiBong, 'DB', 'MaDoiBong', 3);
                }
            },
        },
    }
);
DoiBong.associate = (models) => {
    DoiBong.belongsTo(models.SanThiDau, {
        foreignKey: 'MaSan',
        as: 'SanThiDau',
    });
};
module.exports = DoiBong;
