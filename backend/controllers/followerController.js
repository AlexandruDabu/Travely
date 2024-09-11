const {User} = require("../models/index");

exports.follow = async(req,res) => {
    const{id} = req.params;
    const currentUserId = req.user.userId;
try{
    const currentUser = await User.findByPk(currentUserId);
    const userToFollow = await User.findByPk(id);

    if(!currentUser || !userToFollow){
        return res.status(404).json({message: `User not found`});
    }

    await currentUser.addFollowing(userToFollow);

    await userToFollow.addFollower(currentUser);

    return res.status(200).json({message: `Successfully followed the user`})
}catch(err){
    return res.status(500).json({error:`Error following the user`})
}
}

exports.unfollow = async(req,res) =>{
const {id} = req.params;
const currentUserId = req.user.userId;
try{
    const currentUser = await User.findByPk(currentUserId);
    const userToUnfollow = await User.findByPk(id);

    if(!currentUser || !userToUnfollow){
        return res.status(404).json({message:`User not found`});
    }

    await currentUser.removeFollowing(userToUnfollow);
    await userToUnfollow.removeFollower(currentUser);

    return res.status(200).json({message: `Successfully unfollowed the user`})
}catch(err){
    return res.status(500).json({error: `Error unfollowing the user`})
}
}

exports.getFollowers = async(req,res) => {
    const {userId} = req.user;
    const user = await User.findByPk(userId);
    try{
        const followers = await user.getFollowers();
        if(!followers){
            return res.status(404).json({message: `Failed finding the user`})
        }
        return res.status(200).json({data: followers})
    }catch(err){
        return res.status(500).json({error: `Error loading data`})
    }
}

exports.getFollowings = async(req,res) => {
    const {userId} = req.user;
    const user = await User.findByPk(userId);
    try{
        const followings = await user.getFollowing();
        if(!followings) {
            return res.status(404).json({message: `Failed finding the user`})
        }
        return res.status(200).json({data: followings})
    }catch(err){
        return res.status(500).json({error: `Error loading followings`})
    }
}

exports.getUserFollowers = async(req,res) => {
    const {id} = req.params;
    const user = await User.findByPk(id);
    try{
        const followings = await user.getFollowers();
        if(!followings) {
            return res.status(404).json({message: `Failed finding the user`})
        }
        return res.status(200).json({data: followings})
    }catch(err){
        return res.status(500).json({error: `Error loading followings`})
    }
}
exports.getUserFollowings = async(req,res) => {
    const {id} = req.params;
    const user = await User.findByPk(id);
    try{
        const followings = await user.getFollowing();
        if(!followings) {
            return res.status(404).json({message: `Failed finding the user`})
        }
        return res.status(200).json({data: followings})
    }catch(err){
        return res.status(500).json({error: `Error loading followings`})
    }
}