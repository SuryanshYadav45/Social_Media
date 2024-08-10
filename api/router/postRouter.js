const express=require("express")
const { createPost, likePost, createComment,unsavepost,dislikePost, savepost,deletePost, getAllPost,getpostlike ,getsinglepost,getpostcomment} = require("../controllers/postController")
const router=express.Router()
const authenticateToken=require("../middleware/auth.js")

router.post("/createpost",authenticateToken,createPost)
router.post('/likepost',authenticateToken,likePost)
router.post("/dislike",authenticateToken,dislikePost)
router.post('/comment',authenticateToken,createComment)
router.delete('/deletepost/:postid',authenticateToken,deletePost)
router.get('/getallpost',authenticateToken,getAllPost)
router.get('/getcomment/:postid',authenticateToken,getpostcomment)
router.get('/getlike/:postid',authenticateToken,getpostlike)
router.get('/getpost/:postid',authenticateToken,getsinglepost)
router.get('/savepost/:postid',authenticateToken,savepost)
router.get('/unsavepost/:postid',authenticateToken,unsavepost)
module.exports=router