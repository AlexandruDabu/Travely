const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser, getUsers, updateUser, updateImage, getUserById, getRandomUsers } = require("../services/userServices");
const { generateToken } = require("../JWT-config");
const { update } = require("../services/travelServices");
const {User} = require("../models/index");
const { Op, Sequelize } = require("sequelize");

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
    }

    const { email } = req.body;

    try {
        let user = await getUserByEmail(email);
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = await createUser(req.body);

        const token = generateToken(user);
        // Setting user online
        user = await updateUser(user.id, {status: 'online'})

        return res.status(201).json({ user: user, token:{token: token} });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = generateToken(user);
        // Set user Online
        user = await updateUser(user.id, {status: 'online'})
        
        return res.status(200).json({ msg: 'Logged in successfully', token: {token: token}, user: user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await getUsers({
            attributes: { exclude: ['password'] }
        });

        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


exports.getUserById = async(req,res) => {
    try{
        const {id} = req.params;
        const user = await getUserById(id);
        if(!user){
            return res.status(500).json(`User not found`);
        }
        return res.status(200).json({data: user})
    }catch(err){
        return res.status(500).json(`Internal error ${err}`)
    }
}

exports.updateUser = async(req,res) => {
    try{
        const {id} = req.params;
        const userData = req.body;
        const updatedUser = await updateUser(id,userData);
        return res.status(200).json({message: 'Updated succesfully', data: {updatedUser}})
    }catch(err){
        return res.status(500).json({msg: 'Failed updating user', error: err.message})
    }
}

exports.updateImage = async(req,res) => {
    try{
        const {id} = req.params;
        const imageurl = req.body;
        const updatedUser = await updateImage(id, imageurl);
        return res.status(200).json({data: updatedUser})
    }catch(err){
        return res.status(500).json({msg: `Failed updating the image`, error: err.message})
    }
}


exports.checkAuth = async (req,res) => {
    try{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
            
            return res.status(401).json({message: 'No user logged in'})

        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId
        const user = await getUserById(userId)
        return res.status(200).json({data: user})
    }catch(error){
        return res.status(401).json({message: 'Invalid user'})
    }
}

exports.getLimitedUsers = async(req,res) => {
    try{
        let {searchTerm} = req.query;
        let {page} = req.params;
        page = parseInt(page) || 1;
        const offset = (page-1)*5;
        const { rows: users, count: totalUsers } = await User.findAndCountAll({
            where : searchTerm ? {
                [Op.or] : [
                    {firstName: { [Op.iLike]: `%${searchTerm}%`}},
                    {lastName: { [Op.iLike]: `%${searchTerm}%`}}
                ]
            } : {},
            offset: offset,
            limit: 5,
        });

        return res.json({
            page,
            totalPages: Math.ceil(totalUsers / 5),
            totalUsers,
            data: users
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({message: `Error loading users`})
    }
}



exports.getRandomUsers = async(req,res) => {
    const {country, city} = req.query;
    try{
        const randomUsers = await getRandomUsers(country,city);
        return res.status(200).json(randomUsers)
    }catch(err){
        return res.status(500).json({error :'Failed getting random Users'})
    }
}

exports.setUserOffline = async(req,res) => {
    try{
        console.log(req.params.id)
    const user = await updateUser(req.params.id, {status: 'offline'})
    return res.status(200).json({message: 'User went offline'});
    }catch(err){
        return res.status(500).json({error: 'Couldnt log out the user'})
    }
}
exports.setUserOnline = async(req,res) => {
    try{
    await updateUser(req.params.id, {status: 'online'})
    return res.status(200).json({message: 'User went Online'});
    }catch(err){
        return res.status(500).json({error: 'Couldnt log out the user'})
    }
}

// exports.getCurrentUser = async(req,res) => {
//     try{
//         const token = req.headers.authorization?.split(' ')[1];

//         const user = await getUserById(id);

//         if(!user){
//             return res.status(404).json(`User not found`)
//         }
//         return res.status(200).json({data: user})
//     }catch(err){
//         return res.status(500).json({message: `Failed getting the user ${err}`})
//     }
// }
