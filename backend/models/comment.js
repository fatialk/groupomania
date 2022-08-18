const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
        userId: {type: String, required: true},
        postId: {type: String, required: true},
        comment: {type: String, required: true},
        userPseudo: {type: String, required: true},
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Comment', commentSchema);