const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
        userId: {type: String, required: true},
        userPseudo: {type: String, required: true},
        title: {type: String, required: true},
        description: {type: String, required: true},
        imageUrl: {type: String, required: true},
        likes: {type: Number, required: true},
        dislikes: {type: Number, required: true},
        usersLiked: {type: [String], required: true},
        usersDisliked: {type: [String], required: true},
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Post', postSchema);