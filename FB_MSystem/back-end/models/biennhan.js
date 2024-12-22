const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
        type: DataTypes.DATE,
        allowNull: false,
    },
    NgayHetHan: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfterField(value) {
                if (value <= this.NgayBatDau) {
                    throw new Error('Ngày hết hạn phải lớn hơn ngày bắt đầu.');
                }
            },
        },
    },
    NgayThanhToan: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isAfterField(value) {
                if (value && value < this.NgayBatDau) {
                    throw new Error('Ngày thanh toán không được nhỏ hơn ngày bắt đầu.');
                }
            },
        },
    },
    TinhTrang: {
        type: DataTypes.BOOLEAN, // 0: chưa thanh toán, 1: đã thanh toán
        allowNull: false,
        validate: {
            isIn: [[0, 1]],
        },
    },
}, {
    tableName: 'BIENNHAN',
    timestamps: false,
});

// Thiết lập quan hệ với các bảng khác
BienNhan.associate = (models) => {
    // Một biên nhận liên kết với một đội bóng
    BienNhan.belongsTo(models.DoiBong, {
        foreignKey: 'MaDoiBong',
        as: 'DoiBong',
        onDelete: 'CASCADE', // Xóa đội bóng thì xóa luôn biên nhận
        onUpdate: 'CASCADE',
    });
};

module.exports = BienNhan;
