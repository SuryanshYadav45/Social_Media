const mongoose = require("mongoose");
const PostModel = require("../model/PostModel.js");
const CommentModel = require("../model/CommentModel.js");
const SavedPostModel=require("../model/SavedPostModel.js")
const {
  createPostCommentNotification,
  createPostLikeNotification,
} = require("../helper/notification.js");
const { getIo } = require("../socket.js");

const createPost = async (req, res) => {
  try {
    const { caption, imageurl } = req.body;
    if (!caption || !imageurl) {
      return res.status(403).json({ message: "post details not found" });
    }
    const post = await PostModel.create({
      caption,
      imageurls:imageurl,
      userId: req.user.id,
    });
    if (!post) {
      return res.status(500).json({ message: "Internal Server error" });
    }

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error " });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postid } = req.params;
    const post = await PostModel.findOne({ _id: postid });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId != req.user.id) {
      return res.status(401).json({ message: "You can only delete your post" });
    }
    await PostModel.findByIdAndDelete({ _id: postid });
    await CommentModel.deleteMany({ postId: postid });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPost= async(req,res)=>
  {
    try {
      
      const posts = await PostModel.find().sort({ createdAt: -1 }).populate('userId','username photoUrl');
      res.status(200).json({posts})

    } catch (error) {
      res.status(500).json({message:"internal server error"})
    }
  }


const likePost = async (req, res) => {
  try {
    const { postid } = req.body;
    if (!postid) {
      return res.send(403).json({ message: "post missing" });
    }
    const post = await PostModel.findOne({ _id: postid });
    if (!post) {
      return res.send(404).json({ message: "post not found" });
    }
    
    post.likes.push(req.user.id);
    await post.save();
    await createPostLikeNotification(post.userId.toString(), postid,req.user.id);
    const io = getIo();
    io.emit("postLiked", { postid, userId: post.userId, likerId: req.user.id });
    console.log('Emitted postLiked event:', { postid, userId: post.userId.toString(), likerId: req.user.id });
    res.status(200).json({ message: "post like successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const dislikePost=async(req,res)=>{
  try {
    const { postid } = req.body;
    if (!postid) {
      return res.send(403).json({ message: "post missing" });
    }
    const post = await PostModel.findOne({ _id: postid });
    if (!post) {
      return res.send(404).json({ message: "post not found" });
    }
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter((like) => like!= req.user.id);
    } else {
      return res.send(404).json({message:"User did not liked this post"})
    }
    await post.save();
    res.status(200).json({ message: "post disliked successfully" });
  } catch (error) {
    
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}

const dislike=async(req,res)=>
  {
    const{postid}=req.body;
    try {
     if(!postid)
      {
        return res.status(402).json({message:"details not provided"})
      }
     const post = await PostModel.findOne({_id:postid})
      if(!post)
        {
          return res.status(404).json({message:"post not found "})
        }
        const dislikerId = req.user.id.toString();
        const index = post.likes.indexOf(dislikerId);
        if (index === -1) {
            return res.status(400).json({ message: "User has not liked this post" });
        }
        post.likes.splice(index, 1);
        await post.save();
        res.status(200).json({ message: "Post disliked successfully" });
    } catch (error) {
      res.status(500).json({message:"Internal server errror"})
    }
  }

const createComment = async (req, res) => {
  try {
    const { postid, comment } = req.body;
    if (!postid || !comment) {
      return res.status(403).json({ messsage: "details not provided" });
    }
    const data = await CommentModel.create({
      postId: postid,
      userId: req.user.id,
      text: comment,
    });

    if (!data) {
      return res.status(500).json({ message: "Internal server error" });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      postid,
      { $push: { comments: data._id } },
      { new: true, useFindAndModify: false }
    );

    if (!updatedPost) {
      return res.status(500).json({ message: "Internal server error" });
    }
    await createPostCommentNotification(updatedPost.userId,postid,req.user.id);
    const io = getIo();
    io.emit("postComment", { postid, userId: updatedPost.userId, commenterID: req.user.id });
    console.log('Emitted comment event:', { postid, userId: updatedPost.userId.toString(), likerId: req.user.id });
    res.status(201).json({ message: "comment added", comment: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error " });
  }
};

const getpostcomment=async(req,res)=>
  {
    try {
      const {postid}=req.params;
      const post=await PostModel.findOne({_id:postid})
      if(!post){
        return res.status(404).json({message:"post not found"})
      }
      const comments= await CommentModel.find({postId:postid})
      if(comments.length<0)
        {
          return res.status(404).json({message:"No comment on this post"})
        }
      res.status(200).json({comments})   

    } catch (error) {
      res.status(500).json({message:"internal server error"})
      console.log(error)
    }
  }

  const getpostlike=async(req,res)=>
    {
      try {
        const {postid}=req.params;
        const post = await PostModel.findOne({ _id: postid }).populate('likes','username fullname photoUrl'); // Populate 'likes' array with User details
        if(!post){
          return res.status(404).json({message:"post not found"})
        }
        const userliked=post.likes;
        res.status(200).json({userliked})   
  
      } catch (error) {
        res.status(500).json({message:"internal server error"})
        console.log(error)
      }
    }

const getsinglepost=async(req,res)=>
{
  try {
    const {postid}=req.params;
    const post= await PostModel.find({_id:postid}).populate({
      path: 'comments',
      select:'text createdAt',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'userId',
        select: 'username fullname photoUrl' 
      }
    }).populate({
      path:'likes',
      select:"username fullname photoUrl"
    }).populate('userId','username fullname photoUrl');
    if(!post)
    {
      return res.status(404).json({message:"Post not found "})
    }

    res.status(200).json({post})   
  } catch (error) {
    res.status(500).json({message:"Internal server error"})
    console.log(error)
  }
}

const savepost=async(req,res)=>
{
  try {
    const {postid}=req.params;

    const post=await PostModel.findOne({_id:postid})
    if(!post)
    {
      return res.status(404).json({message:"post not found"})
    }
    const savedpost=await SavedPostModel.create({
      PostId:postid,
      UserId:req.user.id
    })
    
    res.status(200).json({message:"Post saved successfully"})
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal server error"})
  }
}

const unsavepost=async(req,res)=>
  {
    try {
      const {postid}=req.params;
  
      const post=await PostModel.findOne({_id:postid})
      if(!post)
      {
        return res.status(404).json({message:"post not found"})
      }
      const savedpost=await SavedPostModel.findOne({
        PostId:postid,
        UserId:req.user.id
      })
      if(!savedpost)
      {
        return res.status(404).json({message:"post not saved"})
      }

      await SavedPostModel.deleteOne({ _id: savedpost._id });


      
      res.status(200).json({message:"Post unsaved successfully"})
      
    } catch (error) {
      console.log(error)
      res.status(500).json({message:"Internal server error"})
    }
  }
  

module.exports = {savepost,unsavepost, createPost, likePost,dislike,dislikePost, createComment, deletePost,getAllPost,getpostcomment,getpostlike,getsinglepost };
