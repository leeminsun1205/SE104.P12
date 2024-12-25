const { DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const {autoCreateCode} = require('../utils/autoCreateCode')

const SanThiDau = sequelize.define('SanThiDau', {
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
}, {
    tableName: 'SANTHIDAU',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            if (!record.MaSan) {
                record.MaSan = await autoCreateCode(SanThiDau, 'SAN', 'MaSan', 3);
            }
        },
    },
});

module.exports = SanThiDau;
