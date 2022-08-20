const express = require('express');

const router = express.Router();


const auth = require('../middleware/auth');

const commentsCtrl = require('../controllers/comments');

router.get('/post/:id', auth, commentsCtrl.getCommentsByPostId);

router.post('/', auth, commentsCtrl.createComment);

router.delete('/:id', auth, commentsCtrl.deleteComment);

module.exports = router;