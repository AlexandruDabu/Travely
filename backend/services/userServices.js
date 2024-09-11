
const { Sequelize, Op } = require("sequelize");
const {User} = require("../models/index")
const bcrypt = require('bcrypt')

exports.createUser = async(createUserData) => {
    try{
        const newUser = await User.create(createUserData);
        return newUser;
    }catch(err) {
        throw new Error(`Failed to create the user: ${err.message}`)
    }
}

exports.updateUser = async(id, updateUserData) => {
    try{
        const userToUpdate = await User.findByPk(id)
        if(!userToUpdate){
            throw new Error(`User not found`);
        }
        if(!updateUserData.newPassword){
        const updatedUser = await userToUpdate.update(updateUserData)
        return updatedUser;
        }
        if(updateUserData.newPassword !== updateUserData.verifyPassword){
            throw new Error(`Passwords doesn't match`)
        }
        const hashedPassword = await bcrypt.hash(updateUserData.newPassword, 10)
        updateUserData = {...updateUserData,
            password: hashedPassword
        }
        const updatedUser = await userToUpdate.update(updateUserData)
        return updatedUser;
    }catch(err){
        throw new Error(`Error updating the user ${err}`)
    }
}

exports.updateImage = async(id, imageUpdate) => {
    try{
        const userToUpdate = await User.findByPk(id);

        if(!userToUpdate){
            throw new Error(`User not found`);
        }

        const updatedUser = await userToUpdate.update(imageUpdate)
        return updatedUser;
    }catch(err){
        throw new Error(`Error updating the image`)
    }
}

exports.getUserByEmail = async(email) => {
    return User.findOne({where : {email}})
}

exports.getUsers = async (options = {}) => {
    return User.findAll(options);
};


exports.getUserById = async(id) => {
    return User.findByPk(id);
}

exports.getRandomUsers = async(country,city) => {
    return User.findAll({
        order: Sequelize.literal('RANDOM()'),
        limit: 5,
        where: {
            [Op.or] : [
                {country: {[Op.iLike]: `${country}`}},
                {city: {[Op.iLike]: `${city}`}}
            ]
        }
    })
}

exports.getFriendsUsers = async(id) => {
    
}

// exports.getLimitedUsers = async(page) => {
//     try{
//         const skip = (page-1)*10;

//         const users = await User.find().skip(skip).limit(10)

//         const totalUsers = await User.countDocuments();
//     }
// }