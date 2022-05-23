const express = require('express');
const { Comment, User } = require('../models');
const { isLoggedIn } = require('./middlewares');
var router = express.Router();

//댓글 추가
router.post('/insert', async (req, res, next) => {
    console.log(req.body.postId);
    try{
      const comment = await Comment.create({
        comment: req.body.content,
        commenter: req.user.id,
        posts_id: req.body.postId
      });
      res.redirect(`/post/${req.body.postId}/detail`);
    } catch (error) {
      console.error(error);
      next(error);
    }
  
  });

//댓글 삭제
router.delete('/delete', isLoggedIn, async(req, res, next) => {
  try {
    if (req.user.id === req.body.commenterId) {
      Comment.destroy({
        where:{ 
          id: req.body.commentId,
          posts_id: req.body.postId, 
        }
      });
    }
    
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;