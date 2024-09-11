const { Op } = require('sequelize');
const {Travels} = require('../models/index')

exports.getTravels = async() => {
    return await Travels.findAll();
}

exports.getSharedTravels = async() => {
    return await Travels.findAll({where : {isShared:true}})
}

exports.getTravelsByUserId = async(id) => {
    try{
        const allTravels =await Travels.findAll({where: {userId:id}})
        return allTravels
    }catch(error){
        throw new Error(`Error getting Travel by userId: ${error}`)
    }
}

exports.getSharedTravelsByUserId = async(id) => {
    try{
        const allTravels = await Travels.findAll({
            where: {
                [Op.and]: [
                    {isShared: true},
                    {userId: id}
                ]
        }
        })
        return allTravels
    }catch(err){
        throw new Error(`Error getting travels by UserID ${err}`)
    }
}

exports.getTravelsBySearchTerm = async(searchTerm) => {
    try{
        const allTravels = await Travels.findAll({
            where: {
                [Op.and]: [
                    {isShared: true},
                    {[Op.or] : [
                        {
                            title: {
                                [Op.iLike]: `%${searchTerm}%`
                            },
                        },
                        {
                            notes: {
                                [Op.iLike]: `%${searchTerm}%`
                            }
                        },
                        {
                            destination: {
                                [Op.iLike]: `%${searchTerm}%`
                            }
                        },
                    ]}
                ]
                
            }
        })
        return allTravels
    }catch(err){
        throw new Error(`Couldn't find any travel on this Search ${err}`)
    }
}

exports.getTravelById = async(id) => {
    try{
        const Travel = await Travels.findByPk(id);
        return Travel;
    }catch(error){
        throw new Error(`Error getting Travel by Id: ${error}`)
    }
}

exports.share = async(id, userId) =>{
    try{
        const travelToShare = await Travels.findByPk(id);
        if(!travelToShare){
            throw new Error(`Travel with ID ${id} not found`);
        }

        if(userId !== travelToShare.userId){
            throw new Error('Access denied')
        }
        await travelToShare.update({
            ...travelToShare,
            isShared: !travelToShare.isShared
        })
        return travelToShare
    }catch(error){
        throw new Error(`Failed sharing the travel with id ${id}`)
    }
}

exports.create = async(travelData) =>{
    try{
        const createdTravel = await Travels.create(travelData)
        return createdTravel
    }catch(error){
        throw new Error(`Failed creating the travel: ${error}`)
    }
}

exports.update = async(id, travelData, userId) => {
    try{
        const travelToUpdate = await Travels.findByPk(id);
        
        if(!travelToUpdate){
            throw new Error(`Travel with ID ${id} not found`)
        }

        if(userId !== travelToUpdate.userId){
            throw new Error('Access denied')
        }
        await travelToUpdate.update(travelData)

        return travelToUpdate;
    }catch(error){
        throw new Error(`Failed to update the travel ${error}`)
    }
}


exports.remove = async(id, userId) => {
    try{
        const travelToDelete = await Travels.findByPk(id);
        if(travelToDelete.userId !== userId){
            throw new Error(`Access denined`);
        }
        if(!travelToDelete){
            throw new Error(`Travel with ID ${id} not found`);
        }
        await Travels.destroy({where: {id}})
    }catch(err){
        throw new Error(`Failed deleting travel ${err}`)
    }
}