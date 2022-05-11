const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Post = require('../models/post');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/mypost', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      include:{
        model: User,
        where: { id: req.user.id } 
      }
    });
    console("mypost"+post);
    res.send('success');
    res.json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
