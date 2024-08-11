const UserModel = require('../model/UserModel.js')
const nodemailer = require('nodemailer')
const sendcode = require("../helper/sendemail.js")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try {
        const {username,password}=req.body;
        if(!username||!password)
            {
                res.status(400).json({message:"please provide all details"})
            }
        const user= await UserModel.findOne({username})
        if(!user){
           return res.status(404).json({message:"User not found"})
        } 
        if(!user.isVerified)
            {
                return res.status(403).json({message:"email not verified"})
            }
        const checkpassword= await bcrypt.compare(password,user.password)   
        if(checkpassword)
            {
                const token = jwt.sign(
                    { id: user._id, username: user.username,fullname:user.fullname, photoUrl: user.photoUrl, email: user.email },
                    process.env.TOKEN_SECRET,
                    { expiresIn: '1d' }
                  );
                  const TokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);//50 minutes
                user.usertoken=token;
                user.tokenExpiration=TokenExp ;
                await user.save(); 

                res.status(200).json({"usertoken":token,"expiration":TokenExp})
            }
        else{
            res.status(401).json({message:"Incorrect password"})
        }    
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }

}

const Signup = async (req, res) => {
    try {
        const { username, email, password, fullname,photoUrl } = req.body;
        if (!username || !email || !password || !fullname) {
            return res.status(400).json({ "message": "please provide all details" })
        }

        const checkuser = await UserModel.findOne({ email })
        if (checkuser) {
            return res.status(409).json({ message: "user already exist" })
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ username, email, password: hashpassword, fullname,photoUrl })
        if (!user) {
            return res.status(500).json({ message: "Internal server error" })
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        user.verificationCode = verificationCode;
        await user.save();
        await sendcode(email, fullname, verificationCode)
        res.status(201).json({ "message": "Check your email" })

    } catch (error) {
        console.log("error", error)
        res.status(500).json({ "message": "internal server error" })
    }

}

const verifyEmail=async(req,res)=>
    {
        try {
           const {code}=req.body;
           
            const user=await UserModel.findOne({verificationCode:code})
            if(!user)
                {
                    res.status(404).json({message:"Invalid Code"})
                }
           
           user.verificationCode=null;
           user.isVerified=true;
           await user.save()
           res.status(200).json({message:"email verified successfully"})
            
        } catch (error) {
            console.log(error)
            res.status(500).send("internal server error")
        }
    }

module.exports = { login, Signup ,verifyEmail}; 