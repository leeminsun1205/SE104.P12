const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { autoCreateCode } = require('../utils/autoCreateCode');

const LoaiUuTien = sequelize.define('LoaiUuTien', {
    MaLoaiUuTien: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenLoaiUuTien: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    MoTa: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: '',
    },
}, {
    tableName: 'LoaiUuTien',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            if (!record.MaLoaiUuTien) {
                record.MaLoaiUuTien = await autoCreateCode(LoaiUuTien, 'LUT', 'MaLoaiUuTien', 1);
            }
        },
    },
});

module.exports = LoaiUuTien;
