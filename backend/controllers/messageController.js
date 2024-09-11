const { Sequelize } = require("../models");
const {Message} = require("../models/index");

// exports.getMessages = async (req,res) => {
//     const {senderId, receiverId} = req.params;

//     try{
//         const messages = await Message.findAll({
//             where: {
//                 [Sequelize.Op.or]: [
//                     {senderId, receiverId} ,
//                     {senderId: receiverId, receiverId: senderId}
//                 ]
//             },
//             order:[['timestamp', 'ASC']]
//         })
//         return res.status(200).json(messages)
//     }catch(err){
//         console.log(err)
//         return res.status(500).json({error: 'Error to retrieve messages'})
//     }
// }

exports.getMessages = async(req,res) => {
    const {senderId, receiverId} = req.params;
    let {page} = req.params;
    page = parseInt(page) || 1;
    const offset = (page-1)*10;
    try{
        const {rows: messages, count: totalMessages} = await Message.findAndCountAll({
            where: {
                [Sequelize.Op.or]: [
                    {senderId, receiverId},
                    {senderId: receiverId, receiverId: senderId}
                ]
            },
            order:[['timestamp', 'ASC']],
            offset:offset,
            limit: 10
        })
        return res.json({
            page,
            totalMessages: Math.ceil(totalMessages / 5),
            totalMessages,
            data: messages
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({error: 'Error to retrieve messages'})
    }
}

exports.newMessage = async(req,res) => {
    const {senderId, receiverId, text} = req.body;

    try{
        const newMessage = await Message.create({
            senderId, receiverId, text
        })
        return res.status(201).json(newMessage);
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Failed to save message'})
    }
}