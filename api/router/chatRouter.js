const express=require('express');
const authenticateToken = require('../middleware/auth.js');
const router=express.Router();
const {getmessage}=require('../controllers/chatController.js')




router.get('/message/:userId1/:userId2', authenticateToken,getmessage)

module.exports=router;