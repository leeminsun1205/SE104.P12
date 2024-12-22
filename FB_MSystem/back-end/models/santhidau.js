const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const SanThiDau = sequelize.define(
    'SanThiDau',
    {
        MaSan: {
            type: DataTypes.CHAR(10),
            primaryKey: true,
            allowNull: false,
        },
        TenSan: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        DiaChiSan: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },
        SucChua: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 }, // Sức chứa phải lớn hơn 0
        },
        TieuChuan: {
            type: DataTypes.TINYINT,
            allowNull: false,
            validate: { min: 1, max: 5 }, // Tiêu chuẩn từ 1 đến 5 sao
        },
    },
    {
        tableName: 'SANTHIDAU',
        timestamps: false,
        hooks: {
            beforeValidate: async (san) => {
                if (!san.MaSan) {
                    const baseMaSan = `SAN_${san.TenSan.split(' ').map(word => word[0].toUpperCase()).join('')}`;
        
                    const existingCodes = await SanThiDau.findAll({
                        where: {
                            MaSan: {
                                [Op.like]: `${baseMaSan}%`,
                            },
                        },
                        attributes: ['MaSan'],
                    });
        
                    const suffixes = existingCodes.map(code => {
                        const match = code.MaSan.match(/_(\d+)$/);
                        return match ? parseInt(match[1], 10) : 0;
                    });
        
                    const nextSuffix = suffixes.length > 0 ? Math.max(...suffixes) + 1 : 1;
        
                    san.MaSan = suffixes.length > 0 ? `${baseMaSan}_${nextSuffix}` : baseMaSan;
                }
            },

            beforeCreate: async (san) => {
                // Kiểm tra trùng tên sân
                const existingSan = await SanThiDau.findOne({
                    where: {
                        TenSan: san.TenSan,
                    },
                });
        
                if (existingSan) {
                    throw new Error(`Tên sân "${san.TenSan}" đã tồn tại!`);
                }
            },
        },
    }
);

module.exports = SanThiDau;
