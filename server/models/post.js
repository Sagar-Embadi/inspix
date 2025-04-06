import mongoose from 'mongoose';
const { Schema } = mongoose;

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    usersId:{
        type:String,
        required:true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
      }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const Post = mongoose.model('Post', PostSchema);