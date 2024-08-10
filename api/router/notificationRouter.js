const express=require('express');
const authenticateToken = require('../middleware/auth');
const { getnotification } = require('../controllers/notificationRouter');
const router=express.Router();


router.get("/getnotification",authenticateToken,getnotification)



 module.exports=router