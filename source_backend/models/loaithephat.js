const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
        allowNull: false,
    },
}, {
    tableName: 'LOAITHEPHAT',
    timestamps: false, 
});

module.exports = LoaiThePhat;
