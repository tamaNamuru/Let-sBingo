var express = require('express');
var router = express.Router();

var connection = require('../mysqlConnection');
var select = 'SELECT name, count, picture_url, description, priority FROM prize WHERE room_id = $1 ORDER BY priority';
var drop = 'DELETE FROM prize WHERE room_id = $1';
var insert = 'INSERT INTO prize(room_id, prize_id, name, priority, description, picture_url, count) VALUES ($1, $2, $3, $4, $5, $6, $7);";

var multer  = require('multer')
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'public/projects/' + req.session.user.id + '/');
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});
var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('showGoods.html');
});

router.get('/show', function(req, res, next) {
	connection.query(select, [req.session.user.id], function(error, result) {
		if(error) console.log("select error");

		res.render('reading', { prizes: result.rows });
	});
});

router.get('/info', function(req, res, next) {
	connection.query(select, [req.session.user.id], function(error, result) {
		if(error) console.log("select error");

		res.render('keihin_joho', { prizes: result.rows });
	});
});

router.post('/insert', upload.array('pic'), function(req, res, next) {
	//if(!req.body.name) {	//とりあえず何も入力されていなければ何もしない
	//	res.redirect('show');
	//	return;
	//}
	console.log(req.body);
	console.log(req.files);
	let id = req.session.user.id;
	
	//テーブルの内容を消す
	connection.query(drop, [id], function(error, result) {
		if(error) console.log("delete error");
		
		let values = [];
		let pattern = "/" + id + "/";
		if(Array.isArray(req.body.name)){
			//写真のインデックス
			let fileIndex = -1;
			if(Array.isArray(req.files)) fileIndex = 0;
			for(let i=0; i < req.body.name.length; i++){
				if(!req.body.name) continue;

				let name = req.body.name[i];
				let count = req.body.kazu[i];
				let url = null;
				if(req.body.url[i]){
					url = req.body.url[i];
					console.log(url);

					if(url.indexOf(pattern) == -1) {
						if(fileIndex >= 0) url = "/projects/" + id + "/" + req.files[fileIndex++].originalname;
						else url = "/projects/" + id + "/" + req.files[0].originalname;
					}
					console.log(url);
				}
				let desc = req.body.biko[i];
				let pri = req.body.pri[i];
				values.push([id, i+1, name, pri, desc, url, count]);
			}
		} else {	//レコードが一つのみ
			let url = null;
			if(req.body.url){
				url = req.body.url;
				if(url.indexOf(pattern) == -1) {
					url = "/projects/" + id + "/" + req.files[0].originalname;
				}
			}
			values.push([id, 1, req.body.name, req.body.pri, req.body.biko, url, req.body.kazu]);
		}
		//再登録
		connection.query(insert, [values], function(error, result) {
			if(error) console.log("insert error");

			res.redirect('show');
		});
	});
});

module.exports = router;
