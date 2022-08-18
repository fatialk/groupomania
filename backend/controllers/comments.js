const Comment = require('../models/Comment');
const User = require("../models/User");
const Post = require("../models/Post");

exports.createComment = (req, res, next) => {
  console.log('body',req.body);
  const commentObject = req.body;
  delete commentObject._id;
  const comment = new Comment(commentObject);

  User.findOne({ _id: req.auth.userId })
      .then(user => {
        comment.userPseudo = user.pseudo
        comment.save()
            .then(() => res.status(201).json({message: 'comment enregistré !'}))
            .catch(error => res.status(400).json({error}));
      })
      .catch(error => res.status(404).json({ error }));
}

exports.getCommentsByPostId =(req, res, next) => {
  Comment.find({ postId: req.params.id }).sort({createdAt: -1})
  .then(post =>  res.status(200).json(post))
  .catch(error => res.status(404).json({ error }));
}

exports.deleteComment =(req, res, next) => {
    Comment.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Comment supprimée !'}))
        .catch(error => res.status(400).json({ error }));
}