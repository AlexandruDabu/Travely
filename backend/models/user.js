const { DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false, 
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // follower: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        // },
        // following: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true
        // },
        imageurl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        travelsNumber: {
            type: DataTypes.INTEGER,
            allowNull: true
        }

    });

    User.beforeCreate(async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
    });

    User.prototype.isValidPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    User.associate = function(models) {
        User.belongsToMany(models.User, {
            as: 'Followers', 
            through: 'UserFollowers',
            foreignKey: 'userId', 
            otherKey: 'followerId' 
        });

        User.belongsToMany(models.User, {
            as: 'Following', 
            through: 'UserFollowers', 
            foreignKey: 'followerId', 
            otherKey: 'userId' 
        });
    };

    return User;
};
