const express= require('express')
const mongoose = require("mongoose");
const cors=require("cors")
const app=express();
const path =require("path")
require("dotenv").config({path:'./.env'})
const authRouter= require('./router/authRouter.js')
const postRouter= require('./router/postRouter.js')
const userRouter=require('./router/userRouter.js')
const chatRouter=require('./router/chatRouter.js')
const notificationRouter=require('./router/notificationRouter.js')


const { Server } = require("socket.io");
const http = require('http');
const {initializeSocket}=require('./socket.js')
app.use(cors());
app.use(express.json())

mongoose.connect(process.env.CONNECTSTRING).then(()=>
{
    console.log("database connected")
}).catch((error)=>
{
    console.log("error making connection",error)
})

app.use('/auth',authRouter)
app.use('/post',postRouter)
app.use('/user',userRouter)
app.use('/chat',chatRouter)
app.use('/notification',notificationRouter)

const server = http.createServer(app);


// Initialize Socket.io
initializeSocket(server);

server.listen(4000, () => {
    console.log("server started at the specified port ");
});

