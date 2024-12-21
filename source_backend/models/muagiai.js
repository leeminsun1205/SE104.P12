const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MuaGiai = sequelize.define('MuaGiai', {
    MaMuaGiai: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    TenMuaGiai: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    NgayBatDau: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    NgayKetThuc: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfterField(value) {
                if (value <= this.NgayBatDau) {
                    throw new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu.');
                }
            },
        },
    },
}, {
    tableName: 'MUAGIAI',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
MuaGiai.associate = (models) => {
    // Một mùa giải có nhiều vòng đấu
    MuaGiai.hasMany(models.VongDau, {
        foreignKey: 'MaMuaGiai',
        as: 'VongDau',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    // Một mùa giải có nhiều đội bóng qua bảng trung gian MG_DB_CT
    MuaGiai.belongsToMany(models.DoiBong, {
        through: models.MgDbCt,
        foreignKey: 'MaMuaGiai',
        otherKey: 'MaDoiBong',
        as: 'DoiBong',
    });
};

module.exports = MuaGiai;
