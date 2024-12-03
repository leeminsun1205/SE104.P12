const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mg_Db_Ct = sequelize.define('Mg_Db_Ct', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    MaCauThu: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
}, {
    tableName: 'MG_DB_CT',
    timestamps: false,
});

module.exports = Mg_Db_Ct;