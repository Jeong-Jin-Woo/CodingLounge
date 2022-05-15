const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Post, Hashtag, Comment } = require('../models');
const { isLoggedIn } = require('./middlewares');

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

router.get('/:id/detail', async (req, res, next) => {
  const post_id = req.params.id;
  try{
    const post = await Post.findOne({ where : { id : post_id}});
    const comment = await Comment.findAll({ where : { posts_id: post_id}});
    return res.render('post', {
      title: `detail`,
      post: post,
      comment: comment,
    });
  }catch(error){
    console.error(error);
  }
});

router.get('/follow/:id', isLoggedIn, async(req, res, next) => {
  try{
    const user = await User.findOne({ where: { id : req.params.id } });
    const follow = await user.getFollowings({attributes: ['id']});
    const followedIdList = [];
    follow.forEach(user => {
      followedIdList.push(user.id);
    });

    const followPosts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      where : {
        userId : {[Op.in]:followedIdList}
      },
      order: [['createdAt', 'DESC']],
    });

    res.render('main', {
      title: 'prj-name',
      posts: followPosts,
    });
  }catch(err){
    console.error(error);
    next(error);
  }
});

const upload2 = multer();
router.post('/insert', isLoggedIn, upload2.none(), async (req, res, next) => {
  
  const { title,
    story, content } = req.body;
    const postNum = await Post.count();
   
    const user = await User.findOne({ where : { id : req.user.id}});
  
    
    try {
      console.log(req.user);

      const post = await Post.create({
        question_content: req.body.story,
        code_content: req.body.content,
        post_title:req.body.title,
        img: req.body.postImg,
        UserId: req.user.id,
        id:postNum+1,
      });
      const hashtags = req.body.content.match(/#[^\s#]*/g);
      if (hashtags) {
        const result = await Promise.all(
          hashtags.map(tag => {
            return Hashtag.findOrCreate({
              where: { title: tag.slice(1).toLowerCase() },
            })
          }),
        );
        await post.addHashtags(result.map(r => r[0]));
      }
      res.redirect('/');
    } catch (error) {
      console.error(error);
      next(error);
    }
   
});

module.exports = router;
