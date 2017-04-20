var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        nickname: req.cookies.nickname
    });
});

// 登录页面
router.get('/login', function(req, res) {
    res.render('login');
})

// 注册页面
router.get('/reg', function(req, res) {
    res.render('reg', {err: ''});
})

// 退出
router.get('/logout', function(req, res) {

    res.cookie('nickname', '', {
        maxAge: -100
    })

    res.redirect('/');

})
module.exports = router;
