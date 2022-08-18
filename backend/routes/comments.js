const express = require('express');

const router = express.Router();


const auth = require('../middleware/auth');

const commentsCtrl = require('../controllers/comments');
const postsCtrl = require("../controllers/posts");

router.get('/post/:id', commentsCtrl.getCommentsByPostId);

router.post('/', auth, commentsCtrl.createComment);

router.delete('/:id', auth, commentsCtrl.deleteComment);

module.exports = router;