const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { autoCreateCode } = require('../utils/autoCreateCode');

const LoaiUuTien = sequelize.define('LoaiUuTien', {
    MaLoaiUT: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenLoaiUT: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'LoaiUuTien',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            if (!record.MaLoaiUT) {
                record.MaLoaiUT = await autoCreateCode(LoaiUuTien, 'LUT', 'MaLoaiUT', 1);
            }
        },
    },
});

module.exports = LoaiUuTien;
