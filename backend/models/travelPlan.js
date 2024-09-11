const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Travels = sequelize.define('Travels', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
            },
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        totalBudget: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        activities: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        expenses: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        packingList: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        isShared: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false
        },
        userImageurl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'Travels',
    });

    Travels.associate = (models) => {
        Travels.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    };

    return Travels;
};
