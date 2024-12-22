const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const MuaGiai = sequelize.define(
    'MuaGiai',
    {
        MaMuaGiai: {
            type: DataTypes.CHAR(10), 
            primaryKey: true,
            allowNull: false,
        },
        TenMuaGiai: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        NgayBatDau: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        NgayKetThuc: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isAfterStart(value) {
                    if (value <= this.NgayBatDau) {
                        throw new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu.');
                    }
                },
            },
        },
    },
    {
        tableName: 'MUAGIAI',
        timestamps: false,
        hooks: {
            beforeValidate: async (muaGiai) => {
                if (!muaGiai.MaMuaGiai) {
                    const year = new Date(muaGiai.NgayBatDau).getFullYear();
                    const baseMaMuaGiai = `MG${year}`;
        
                    const existingCodes = await MuaGiai.findAll({
                        where: {
                            MaMuaGiai: {
                                [Op.like]: `${baseMaMuaGiai}%`,
                            },
                        },
                        attributes: ['MaMuaGiai'],
                    });
        
                    const suffixes = existingCodes.map(code => {
                        const match = code.MaMuaGiai.match(/_(\d+)$/);
                        return match ? parseInt(match[1], 10) : 0;
                    });
        
                    const nextSuffix = suffixes.length > 0 ? Math.max(...suffixes) + 1 : 1;
        
                    muaGiai.MaMuaGiai = `${baseMaMuaGiai}_${nextSuffix}`;
                }
            },
        },
    }
);

module.exports = MuaGiai;
