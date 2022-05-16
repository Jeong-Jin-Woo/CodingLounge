const express = require('express');
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();
const url = require('url');

try {
  fs.readdirSync('profileimg');
} catch (error) {
  console.error('profileimg 폴더가 없어 profileimg 폴더를 생성합니다.');
  fs.mkdirSync('profileimg');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'profileimg/');
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});


router.post('/join', isNotLoggedIn, upload.single('img'), async (req, res, next) => {
  const { id, nick, password } = req.body;
  console.log(req.file);
  try {
    const exUser = await User.findOne({ where: { id } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      id,
      nick,
      password: hash,
      user_image: req.file.path,
    });
    res.send("<script>alert('정상적으로 회원가입 되었습니다.');location.href='/';</script>");
    //return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    
    console.log("useruseruser",user.dataValues.id);
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect(url.format({
        pathname:"/",
        query:{
          "id":user.dataValues.id,
        },
      }));
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
