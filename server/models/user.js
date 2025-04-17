import mongoose from "mongoose"
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
    },
    email :{
        type : String,
        required : true,
        unique : true,
    },
    password :{
        type : String,
        required:true,
    },
    confirmpassword : {
        type : String,
        required : true,
    },
    displayName: { 
        type: String,
        trim: true,
    },
    profilePicture : {
        type:String,
        default:"https://th.bing.com/th/id/OIP.Icb6-bPoeUmXadkNJbDP4QHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3"
    },
    bio: { 
        type: String,
        default: '',
        trim: true
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }], 
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
    saved: [{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }],
    posts: [],
    notifications: [{
        type: { type: String,  },
        postId: { type: Schema.Types.ObjectId, ref: 'Post' },
        fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
    }],
})

export const User = mongoose.model('User', UserSchema);