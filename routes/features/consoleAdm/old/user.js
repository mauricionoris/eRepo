
var express = require('express');
var userRouter = express.Router();
var requiresLogin = require('../../common/requiresLogin');

userRouter.get('/user',requiresLogin, function (req, res) {
     
    
  res.render('user', {
   // user: req.user,
    AKey: 'req.session.AKey',
    ASecret: req.session.ASecret
  });
});


module.exports = userRouter;
