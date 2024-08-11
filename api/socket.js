const MessageModel=require('./model/MessageModel.js')
const PostModel=require('./model/PostModel.js')
const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Allow requests from any origin
            methods: ["GET", "POST"] // Allow these HTTP methods
        }
    });

    const userSocketMap = new Map();

    io.on('connection', (socket) => {
        
        console.log("user connected with socket",socket.id)

        socket.on('register',(data)=>
        {
            const{userId}=data;
            userSocketMap.set(userId,socket.id)
            console.log(`User ${userId} registered with socket ID ${socket.id}`)
        })

        socket.on('private_message', async (data) => {
            const { senderId, receiverId, content } = data;
            console.log(`Message from ${senderId} to ${receiverId}: ${content}`);
            
            // Save message to database
            const message = new MessageModel({
                sender: senderId,
                receiver: receiverId,
                content
            });
            await message.save();

            // Emit message to receiver
            const receiverSocketId = userSocketMap.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('new_message', {
                    senderId,
                    content,
                    timestamp: message.timestamp
                });
            }
        });

        socket.on('sharePost',async (data)=>
        {
            
            const{postId,recipientId,senderId}=data;
            const post = await PostModel.findById({_id:postId});
            
            const message = {
                sender: senderId,
                receiver: recipientId,
                type: 'post',
                content: {
                  title: post.caption,
                  imageUrl: post.imageurls[0],
                },
                timestamp: new Date(),
              };
             
              await MessageModel.create(message);
            //   const receiverSocketId = userSocketMap.get(receiverId);
            //   if (receiverSocketId) {
            //     io.to(receiverSocketId).emit('new_message', {
            //         senderId,
            //         content,
            //         timestamp: message.timestamp
            //     });
            // }
            console.log("Data reciever in socket= ",message)
        }
        )

        socket.on('disconnect', () => {
            console.log(`User disconnected`);
            for (const [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = { initializeSocket, getIo };
