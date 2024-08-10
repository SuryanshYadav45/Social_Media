const mongoose=require('mongoose')

const SavedPostSchema= new mongoose.Schema({
    PostId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'post',
        require:true
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:true
    }
})

const SavedPostModel= new mongoose.model('savedpost',SavedPostSchema)

module.exports=SavedPostModel;