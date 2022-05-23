const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Post, Hashtag, Comment,PostHashtag } = require('../models');
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

  res.json({ url: `/img/${req.file.filename}` });
});

router.get('/:id/detail', async (req, res, next) => {
  const post_id = req.params.id;
  try{
    const post = await Post.findOne({ 
      include: {
          model: User,
          attributes: ['id', 'user_image', 'nick'],
      },
      where : { id : post_id}});
    const comment = await Comment.findAll({ 
      include: {
        model: User,
        attributes: ['id', 'nick', 'user_image'],
      },
    where : { posts_id: post_id}
    });
    const posthashtag = await PostHashtag.findOne({where: {PostId:post_id}})
    let posthashtagId;
    let hashtag;
    if(posthashtag){
      posthashtagId = posthashtag.HashtagId;
      hashtag = await Hashtag.findOne({where:{id:posthashtagId}})
    }
    if(hashtag){
     return res.render('post', {
      title: `detail`,
      post: post,
      comment: comment,
      hashtag:hashtag,
    });
  }else{
    return res.render('post', {
      title: `detail`,
      post: post,
      comment: comment,
     
    });
  }
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
        attributes: ['id', 'nick', 'user_image'],
      },
      where : {
        userId : {[Op.in]:followedIdList}
      },
      order: [['createdAt', 'DESC']],
    });
    const hashtag = await Hashtag.findAll({});
    const postHashtag = await PostHashtag.findAll({});
   
    res.render('follow', {
      title: 'prj-name',
      posts: followPosts,
      hashtag:hashtag,
      postHashtag:postHashtag,
    });
  }catch(err){
    console.error(error);
    next(error);
  }
});

const upload2 = multer();
router.post('/insert', isLoggedIn, upload2.none(), async (req, res, next) => { 
  const { title, story, content } = req.body;
 
    const postNum = await Post.count(); 
    const user = await User.findOne({ where : { id : req.user.id}});
    
    try {
    
      const post = await Post.create({
        question_content: req.body.story,
        code_content: req.body.content,
        post_title:req.body.title,
        post_img: req.body.url,
        UserId: req.user.id,
        id:postNum+1,
      });
  
      if (req.body.hashtagss) {
             const [hashtagresult,created] =await Hashtag.findOrCreate({           
              where: { title: req.body.hashtagss },
            })       
            PostHashtag.create({
              HashtagId:hashtagresult.id,
              PostId:postNum+1,
            })
    }
      res.redirect('/');
    } catch (error) {
      console.error(error);
      next(error);
    }
   
});

module.exports = router;
