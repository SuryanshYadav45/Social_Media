const MessageModel = require("../model/MessageModel");


const getmessage=async(req,res)=>
    {
        try {
            const { userId1, userId2 } = req.params;
    
            // Fetch messages from the database
            const messages = await MessageModel.find({
                $or: [
                    { sender: userId1, receiver: userId2 },
                    { sender: userId2, receiver: userId1 }
                ]
            }).populate('sender receiver','_id username photoUrl').sort({ createdAt: 1 }); // Sort by createdAt in ascending order
    
            res.status(200).json( messages );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


module.exports={getmessage}    