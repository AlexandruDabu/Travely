const { check } = require("express-validator");

const express = require('express');
const { register, login, getAllUsers, checkAuth, logout, updateUser, getUserById, updateImage, follow, unfollow, getFollowers, getLimitedUsers, getRandomUsers, setUserOffline, setUserOnline, getRandomFriends } = require("../controllers/authController");
const { authJWT } = require("../JWT-config");
const { specificLimiter } = require("../middlewares/limiterMiddleware");
const router = express.Router();


router.post('/register', [
    check('email', 'Please include a valid Email').isEmail(),
    check('password','Please include a password with 6 or more character').isLength({min: 6})
], register)

router.post('/login', [
    check('email', 'Please include a valid Email').isEmail(),
    check('password','Please include a password with 6 or more character').isLength({min: 6})
], specificLimiter, login)

// router.get('/user/:id', authJWT, getUserById)

router.post('/setOffline/:id', authJWT, setUserOffline)

router.post('/setOnline/:id', authJWT, setUserOnline)

router.get('/limitedUsers/:page', getLimitedUsers)

router.put('/updateImage/:id', authJWT, updateImage)

router.put('/updateUser/:id', authJWT, updateUser)

router.get('/randomUsers', authJWT, getRandomUsers)

router.get('/users/:id', getUserById)

router.get('/', authJWT, getAllUsers);


router.get('/check', checkAuth)


module.exports = router;