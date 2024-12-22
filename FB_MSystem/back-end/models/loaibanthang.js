const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { autoCreateCode } = require('../utils/autoCreateCode');

const LoaiBanThang = sequelize.define('LoaiBanThang', {
    MaLoaiBanThang: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenLoaiBanThang: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    MoTa: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: '',
    },
}, {
    tableName: 'LOAIBANTHANG',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            if (!record.MaLoaiBanThang) {
                record.MaLoaiBanThang = await autoCreateCode(LoaiBanThang, 'LBT', 'MaLoaiBanThang', 2);
            }
        },
    },
});

module.exports = LoaiBanThang;
