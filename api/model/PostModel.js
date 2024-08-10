const mongoose= require("mongoose")

const PostSchema= new mongoose.Schema({
    caption:{
        type:String,
        required:true
    },
    imageurls:{
        type:Array,
        // required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const PostModel= new mongoose.model('post',PostSchema)

module.exports=PostModel