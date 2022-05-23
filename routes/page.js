const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag, Comment, PostHashtag } = require('../models');

const router = express.Router();
const sequelize = require("sequelize");
const passport = require('passport');
const Op = sequelize.Op;
router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/profile', isLoggedIn, async (req, res) => {
    try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick','user_image'],
      },
      where:{
        UserId : req.user.id
      },
      order: [['createdAt', 'DESC']],     
    });
    const comments = await Comment.findAll({
      include:{
        model: Post,
        attributes: ['id','post_title','UserId'],
        include:{
          model: User,
          attributes: ['id', 'nick'],
        },
      },
      where:{
        commenter: req.user.id
      },
      order: [['created_at', 'DESC']],
    });
    res.render('profile', {
      title: 'profile',
      posts: posts,
      comments: comments
    });
  } catch (err) {
    console.error(err);
  }
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: 'join us' });
});

router.get('/login', isNotLoggedIn, (req, res) => {
  let userId = "";
  if(req.cookies['loginId'] !== undefined){
    userId = req.cookies['loginId'];
  }
  res.render('login', { title: 'login' , saveId : userId });
});

router.get('/post', (req, res) => {
  res.render('post', { title: 'post' });
});

router.get('/insert', isLoggedIn, (req, res) => {
  try {
  res.render('insert', { title: 'posting',
    UserId:req.user,
});
  }catch(err){
    console.error(err);
  }
});

router.get('/profileUpdate', isLoggedIn, (req, res) => {
  res.render('profileUpdate', {
    title: 'profileupdated',
    UserId:req.user,
  });
});

router.get('/', async (req, res, next) => {
  
  passport.serializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err,user);
    })
  })
  try {
    const posts = await Post.findAll({
      include:[
        {
          model: User,
          attributes: ['id', 'nick', 'user_image'],
        },
    ],
      order: [['createdAt', 'DESC']],
    });

    const hashtag = await Hashtag.findAll({});
    const postHashtag = await PostHashtag.findAll({});
    res.render('main', {
        title: 'CodingLounge',
        posts: posts,
        hashtag:hashtag,
        postHashtag:postHashtag,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/hashtag', async (req, res, next) => {
  const query = req.body.hash; 
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query} });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });      
    }else{ //all 의 경우
      posts = await Post.findAll({
        include:[
          {
            model: User,
            attributes: ['id', 'nick', 'user_image'],
          },
      ],
        order: [['createdAt', 'DESC']],
      });
    }

    return res.send(posts);
    
  } catch (error) {
    
    console.error(error);
    return next(error);
  }
});

router.get('/search', async (req, res, next) => {
  const item = req.query.item;
  try {
    const posts = await Post.findAll({ 
      where: {
        post_title: {
          [Op.like] :"%"+item+"%"
        }
      },
      include:[
        {
          model: User,
          attributes: ['id', 'nick','user_image'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.render('main', {
      title: `Q&A`,
      posts: posts,
    });
  } catch (error) {
    
    console.error(error);
    return next(error);
  }
});

module.exports = router;
