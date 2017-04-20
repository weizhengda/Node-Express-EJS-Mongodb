var express = require('express');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/project';

var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// 注册
router.post('/addUser', function(req, res) {

    // 注册我们怎么做？
    // 将注册信息写入数据库  要开启数据库的服务

    // 先拿到前端数据
    var uid;
    var username = req.body.username;
    var password = req.body.password;
    var nickname = req.body.nickname;

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if (err) {
            console.log(err);
        } else {
            var coll = db.collection('users');
            async.waterfall([
                // 第一个异步，判断是否有相同的用户名
                function(cb) {
                    var data = {
                        username: username
                    }
                    coll.find(data).count(function(err, num) {
                        if (err) {
                            console.log(err);
                        } else {
                            if (num > 0) {
                                cb('用户名存在');
                            } else {
                                cb(null);
                            }
                        }
                    })
                },
                // 第二个异步，是获取记录的总条数
                function(cb) {
                    // 查询的操作
                    coll.find().count(function(err, num) {
                        if (err) {
                            console.log(err);
                        } else {
                            // console.log(num);
                            cb(null, num);
                        }
                    })
                },
                // 第三个异步，获取最大的那个uid
                function(num, cb) {

                    // num 有可能等于 0
                    if (num > 0) {
                        // 总条数
                        var num = num - 1;
                        coll.find().skip(num).toArray(function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                var uid = data[0].uid;
                                cb(null, uid);
                            }
                        })
                    } else {
                        cb(null, num);
                    }

                },
                // 第四个异步，注册用户
                function(uid, cb) {
                    uid = uid + 1;
                    var data = {
                        'username': username,
                        'password': password,
                        'nickname': nickname,
                        'uid': uid
                    };
                    coll.insertOne(data, function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            cb(null, data);
                        }
                    })
                }
            ], function(err, result) {
                if (err) {
                    // res.send(err);
                    // 直接使用 send的话，会把页面直接给替换了。。。
                    // 如果还是想在当前注册页面，并且有错误提示。。。怎么做

                    res.render('reg', {err: err});
                } else {
                    console.log('注册成功');

                    // 注册成功   localhost:3000/login
                    res.redirect('/login');
                }

                // 关闭
                db.close();
            })
        }
    })
})

// 登录
router.get('/login', function(req, res) {
    var username = req.query.username;
    var password = req.query.password;

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if (err) {
            console.log(err);
        } else {
            var coll = db.collection('users');

            var data = {
                username: username,
                password: password
            }

            coll.find(data).toArray(function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    var nickname = data[0].nickname;
                    // cookie
                    // 登录成功。存一个cookie
                    // 存cookie
                    // maxAge 要的单位是毫秒
                    // 60 * 1000 就是一分钟
                    res.cookie('nickname', nickname, {
                        maxAge: 20 * 60 * 1000
                    })

                    // res.render('login', {nickanme: nickanme})
                    res.redirect('/');
                }
            })
        }
    })
})

module.exports = router;
