const express = require('express');
const { Comment } = require('../models');
var router = express.Router();

router.post('/', async (req, res, next) => {
    console.log(req.body.postId);
    try{
      const comment = await Comment.create({
        comment: req.body.content,
        commenter: req.user.id,
        posts_id: req.body.postId
      });
      res.redirect(`/post/${req.body.postId}/detail`); // 여기 처리
    } catch (error) {
      console.error(error);
    }
  
  });
  
  module.exports = router;