const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Post = require('../models/post');

const router = express.Router();

// 팔로우 추가
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
     // await user.addFollowing(parseInt(req.params.id, 10));
      await user.addFollowing(req.params.id);
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로워 삭제
router.delete('/:id/removeFollow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.removeFollowers(req.params.id);
      // await user.removeFollowers(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로잉 삭제
router.delete('/:id/removeFollowing', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.removeFollowing(req.params.id);
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
