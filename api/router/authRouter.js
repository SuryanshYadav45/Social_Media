const express=require('express')
const router=express.Router();
const {login, Signup, verifyEmail}=require('../controllers/authController.js')

router.post('/login',login)
router.post('/signup',Signup)
router.post("/verifyemail",verifyEmail)
module.exports=router;