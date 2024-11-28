const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utxephang = sequelize.define('Utxephang', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Muagiai', // Tên bảng mùa giải, nếu có
            key: 'MaMuaGiai',
        },
    },
    MaLoaiUT: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Loaiuutien', // Tên bảng loại ưu tiên, nếu có
            key: 'MaLoaiUT',
        },
    },
    MucDoUT: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'UT_XEPHANG',
    timestamps: false,
});

module.exports = Utxephang;
