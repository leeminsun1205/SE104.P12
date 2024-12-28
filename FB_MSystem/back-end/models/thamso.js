const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ThamSo = sequelize.define('ThamSo', {
    id: {
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey: true,
    },
    SucChuaToiThieu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
    },
    TieuChuanToiThieu: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 },
    },
    TuoiToiThieu: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    TuoiToiDa: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoLuongCauThuToiThieu: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoLuongCauThuToiDa: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    SoCauThuNgoaiToiDa: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    LePhi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 500 },
    },
    ThoiDiemGhiBanToiDa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
    },
    DiemThang: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    DiemHoa: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
    DiemThua: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 0 },
    },
}, {
    tableName: 'THAMSO',
    scheme: 'se104',
    timestamps: false,
});

module.exports = ThamSo;
