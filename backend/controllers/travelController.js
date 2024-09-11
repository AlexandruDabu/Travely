const { v4: uuidv4 } = require('uuid');
const { getTravelsByUserId, create, update, getTravels, getSharedTravels, getTravelById, share, remove, getTravelsBySearchTerm, getSharedTravelsByUserId } = require("../services/travelServices");
const { getUserById, updateUser } = require('../services/userServices');

exports.allTravels = async(req,res) => {
    try{
        const allTravels = await getTravels();
        return res.status(200).json({data: allTravels});
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

exports.allSharedTravels = async(req,res) => {
    try{
        const allSharedTravels = await getSharedTravels();
        return res.status(200).json({data: allSharedTravels})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

exports.travelsByUserId = async(req,res) => {
    try{
        const allTravels = await getTravelsByUserId(req.params.id)
        return res.status(200).json({data: allTravels});
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

exports.sharedTravelsByUserId = async(req,res) =>{
    try{
        const allTravels = await getSharedTravelsByUserId(req.params.id)
        return res.status(200).json({data: allTravels})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

exports.travelsBySearchTerm = async(req,res) => {
    try{
        const {searchTerm} = req.query;
        if(searchTerm==null){
            const allTravels = await this.allSharedTravels();
            return res.status(200).json(allTravels);
        }
        const allTravels = await getTravelsBySearchTerm(searchTerm);
        if(!allTravels){
            return res.status(404).json({error: `No travels found with on search`})
        }
        return res.status(200).json({data: allTravels})
    }catch(err){
        return res.status(500).json(err)
    }
}

exports.travelsById = async(req,res) =>{
    try{
        const travel = await getTravelById(req.params.id)
        return res.status(200).json({data: travel});
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

exports.shareTravel = async(req,res) =>{   
    try{
        const {id} = req.params;
        const {userId} = req.user; 
        const travelToShare = await share(id,userId);
        return res.status(200).json({
            success: true,
            message: `Travel with ID ${id} successfully updated.`,
            data: travelToShare})
    }catch(err){
        return res.status(500).json({error: err.message})
    }
}

exports.createTravel = async(req,res) => {
    try{
        const {userId, imageurl} = req.user
        if(!userId){
            return res.status(400).json({error: 'User ID is required'})
        }
        const travelData = {
            ...req.body,
            userId: userId,
            isShared: false,
            id: null,
            userImageurl:imageurl
        }
        let userTravels = await getUserById(userId);
        await updateUser(userId, {travelsNumber: userTravels.dataValues.travelsNumber+1})
        createdTravel = await create(travelData);

        return res.status(201).json({data: createdTravel})
    }catch(err){
        console.log(err)
        return res.status(500).json({error: err.message})
    }
}

exports.updateTravel = async(req,res) =>{
    const {id} = req.params;
    const travelData = req.body;
    const {userId} = req.user
    try{
        const updatedTravel = await update(id,travelData,userId);
        return res.status(200).json({
            success: true,
            message: `Travel with ID ${id} successfully updated.`,
            data: updatedTravel
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: `Failed updating the travel ${err}`
        })
    }
}

exports.deleteTravel = async(req,res) => {
    const {id} = req.params;
    const {userId} = req.user
    try{
        const deleted = await remove(id,userId);
        let userTravels = await getUserById(userId);
        await updateUser(userId, {travelsNumber: userTravels.dataValues.travelsNumber-1})
        return res.status(204).json({
            success:true,
            message: 'Deleted succesfully'
        })
    }catch(err){
        return res.status(500).json({
            error: err.message
        })
    }
}