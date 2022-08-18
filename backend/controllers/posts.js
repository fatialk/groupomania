const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = (req, res, next) => {
  console.log('body',req.body);
  console.log('userId', req.auth.userId)
  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  delete postObject._userId;
  const post = new Post(postObject);
  User.findOne({ _id: req.auth.userId })
      .then(user =>  {
        post.userPseudo = user.pseudo
        post.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        post.likes = 0;
        post.dislikes = 0;
        console.log('post', post)
        post.save()
            .then(() => res.status(201).json({ message: 'post enregistré !'}))
            .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(404).json({ error }));


}


exports.modifyPost = (req, res, next) => {
  const postObject = req.file ? {
    ...JSON.parse(req.body.post),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };



  delete postObject.userId;
  console.log('postObject', postObject);
  Post.findOne({_id: req.params.id})
  .then((post) => {
    User.findOne({ _id: req.auth.userId }).then(user =>  {
      if (post.userId === req.auth.userId || user.isAdmin) {
        Post.updateOne({ _id: req.params.id}, { ...postObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
      } else {
        res.status(401).json({ message : 'Not authorized'});
      }
    });
  })
  .catch((error) => {
    res.status(400).json({ error });
  });
};


exports.deletePost =(req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Post supprimée !'}))
  .catch(error => res.status(400).json({ error }));
}

exports.getOnePost =(req, res, next) => {
  Post.findOne({ _id: req.params.id })
  .then(post =>  res.status(200).json(post))
  .catch(error => res.status(404).json({ error }));
}

exports.getAllPosts =(req, res, next) => {
  Post.find().sort({createdAt: -1})
  .then(posts => res.status(200).json(posts))
  .catch(error => res.status(400).json({ error }));
}

exports.likePost =(req, res, next) => {
  console.log(req.params.id);
  Post.findOne({ _id: req.params.id })
  .then(post => {
    
    const like = req.body.like;
    const userId = req.body.userId;
    if(like === 0)
    {
      const indexUserLiked = post.usersLiked.indexOf(userId);
      if (indexUserLiked !== -1) {
        post.usersLiked.splice(indexUserLiked, 1);
        post.likes--
      }
      const indexUserDisLiked = post.usersDisliked.indexOf(userId);
      if (indexUserDisLiked !== -1) {
        post.usersDisliked.splice(indexUserDisLiked, 1);
        post.dislikes--
      }
      
    }
    if(like === 1)
    {
      post.usersLiked.push(userId);
      post.likes = post.likes ? ++post.likes : 1
    }
    if(like === -1)
    {
      post.usersDisliked.push(userId);
      post.dislikes = post.dislikes ? ++post.dislikes : 1
    }
    const postModified = {
      likes : post.likes,
      dislikes : post.dislikes,
      usersLiked : post.usersLiked,
      usersDisliked : post.usersDisliked,
    }
    Post.updateOne({ _id: req.params.id}, { ...postModified, _id: req.params.id})
    .then(() => res.status(200).json(post))
    .catch(error => res.status(401).json({ error }));
  })
  .catch(error => res.status(404).json({ error }));
}