const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ThanhTich = sequelize.define('ThanhTich', {
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'DoiBong',
            key: 'MaDoiBong',
        }
    },
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'MuaGiai',
            key: 'MaMuaGiai',
        }
    },
    SoTranDaThiDau: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoTranThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoTranHoa: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    SoTranThua: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    XepHang: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
}, {
    tableName: 'THANHTICH',
    timestamps: false,
});

module.exports = ThanhTich;
