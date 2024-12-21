const { DataTypes } = require('sequelize');
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
            beforeValidate: (muaGiai) => {
                // Nếu chưa có mã mùa giải, tự động tạo
                if (!muaGiai.MaMuaGiai) {
                    const year = new Date(muaGiai.NgayBatDau).getFullYear();
                    muaGiai.MaMuaGiai = `MG${year}`;
                }
            },
        },
    }
);

module.exports = MuaGiai;
