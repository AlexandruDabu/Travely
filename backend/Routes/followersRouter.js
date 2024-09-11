const { getFollowers, follow, unfollow, getFollowings, getUserFollowers, getUserFollowings } = require("../controllers/followerController");

const express = require('express');
const { authJWT } = require("../JWT-config");

const router = express.Router();

router.post('/follow/:id', authJWT, follow);

router.delete('/unfollow/:id', authJWT, unfollow)

router.get('/followers', authJWT, getFollowers)

router.get('/followings', authJWT, getFollowings)

router.get('/followers/:id', authJWT, getUserFollowers)

router.get('/followings/:id', authJWT, getUserFollowings)

module.exports = router;