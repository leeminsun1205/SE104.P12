const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const {autoCreateCode} = require('../utils/autoCreateCode')
const DangNhap = sequelize.define('DangNhap', {
    MaNguoiDung: {
        type: DataTypes.CHAR(15),
        allowNull: false,
        primaryKey: true,
    },
    TenDangNhap: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    MatKhau: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'DangNhap',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            if (!record.MaNguoiDung) {
                record.MaNguoiDung = await autoCreateCode(DangNhap, 'user', 'MaNguoiDung', 10);
            }
        },
    },
});

module.exports = DangNhap;
