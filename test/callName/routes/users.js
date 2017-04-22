/**
 * Created by Jayce on 2017/4/21 0021.
 */
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');

var DB_CONN_STR = 'mongodb://localhost:27017/random';
var router = express.Router();
/* GET users listing. */

router.get('/addCounts', function (req, res, next) {
	var uid = parseInt(req.query.uid);
	MongoClient.connect(DB_CONN_STR, function (err, db) {
		if (err) {
			console.log(err);
		} else {
			var coll = db.collection('sz1701');
			coll.update({uid: uid}, {$inc: {counts: 1}});
			db.close();
		}
	})
});

router.get('/list', function (req, res, next) {
	var gradeId = req.query.gradeId;
	// 获取所有的列表数据
	MongoClient.connect(DB_CONN_STR, function (err, db) {
		if (err) {
			console.log(err);
		} else {
			var coll = db.collection('sz'+parseInt(gradeId));
			async.waterfall([
				function (cb) {
					coll.find().count(function (err, num) {
						if (err) {
							console.log(err);
						} else {
							cb(null, num);
						}
					})
				},
				function (num, cb) {
					
					var counts = num;       // 总条数
					var pageSize = 10;       // 每页显示的条数
					var pageCounts = Math.ceil(counts / pageSize);  // 总的页数
					var pageNo = req.query.pageNo ? req.query.pageNo : 1;
					
					coll.find().skip((pageNo - 1) * pageSize).limit(pageSize).sort({counts: -1}).toArray(function (err, data) {
						if (err) {
							console.log(err);
							res.send('没有信息');
						} else {
							// console.log(data);
							for (var i = 0; i < data.length; i++) {
								if (data[i].content) {
									data[i].content = data[i].content.replace(/src="xhed/g, 'src="/xhed');
								}
							}
							cb(null, [data, pageCounts, pageNo]);
						}
					})
				}
			], function (err, result) {
				
				if (err) {
					console.log(err);
				} else {
					res.render('list.ejs', {
						gradeId: gradeId,
						dataList: result[0],
						pageCounts: result[1],
						pageNo: result[2]
					});
				}
			})
		}
	})
});


module.exports = router;
