const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { autoCreateCode } = require('../utils/autoCreateCode');

const BienNhan = sequelize.define('BienNhan', {
    MaLePhi: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
    },
    MaDoiBong: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
            model: 'DoiBong', // Tên bảng tham chiếu
            key: 'MaDoiBong',
        },
    },
    SoTien: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    NgayBatDau: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    NgayHetHan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    NgayThanhToan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null, // Giá trị mặc định là null
    },
    TinhTrang: {
        type: DataTypes.BOOLEAN, // true: chưa thanh toán, false: đã thanh toán
        allowNull: false,
        defaultValue: false, // Giá trị mặc định là false
    },
}, {
    tableName: 'BIENNHAN',
    timestamps: false,
    hooks: {
        beforeValidate: async (record) => {
            // Tự động tạo mã biên nhận nếu chưa có
            if (!record.MaLePhi) {
                record.MaLePhi = await autoCreateCode(BienNhan, 'BN', 'MaLePhi', 4);
            }

            // Tự động đặt giá trị mặc định cho NgayThanhToan và TinhTrang
            if (record.NgayThanhToan === undefined) {
                record.NgayThanhToan = null;
            }
            if (record.TinhTrang === undefined) {
                record.TinhTrang = false;
            }
        },
    },
});

// Thiết lập quan hệ với bảng DoiBong
BienNhan.associate = (models) => {
    BienNhan.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
    });
};

module.exports = BienNhan;
