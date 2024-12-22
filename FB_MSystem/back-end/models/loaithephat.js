const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { autoCreateCode } = require('../utils/autoCreateCode');

const LoaiThePhat = sequelize.define('LoaiThePhat', {
    MaLoaiThePhat: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenLoaiThePhat: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    MoTa: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: '',
    },
}, {
    tableName: 'LOAITHEPHAT',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            if (!record.MaLoaiThePhat) {
                record.MaLoaiThePhat = await autoCreateCode(LoaiThePhat, 'LTP', 'MaLoaiThePhat', 1);
            }
        },
    },
});

module.exports = LoaiThePhat;
