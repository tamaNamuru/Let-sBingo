var express = require('express');
var router = express.Router();

/*var connection = require('../mysqlConnection');*/
var select = 'SELECT name FROM room WHERE room_id = @room_id AND password = @password';

var insert = 'INSERT INTO room(room_id, password, name) VALUES(@room_id, @password, @name)';
var insert_card = "INSERT INTO card(room_id) VALUES(@room_id)";

var fs = require('fs');


var Connection = require('tedious').Connection;

var dbConfig = {
	userName: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	
	options: {encrypt: true, database: 'bingo'}
};

//var connection = new Connection(dbConfig);

var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('adminlogin', {title: "Let's BINGO!"});
});

router.get('/signup', function(req, res, next) {
	res.render('新規作成画面');
});

//新規登録
router.post('/signup', function(req, res, next) {
	var connection = new Connection(dbConfig);
	//入力されているかのチェックなくてもいい
	if(req.body.name && req.body.password){
		//データベースに登録
		let id = ('000' + Math.floor(Math.random() * (10000))).slice(-4);
		connection.on('connect', function(error2) {
			request = new Request("SELECT name FROM room WHERE name = '" + req.body.name + "';", function(error3) {
				console.log(error3);
			});
			var result = "";
			request.on('row', function(columns) {
				columns.forEach(function(column) {
					console.log("tama");
					result+= column.value;
				});
				if(result != null){
					res.render('新規作成画面', { error: "すでに同じ名前の部屋があります。"});
					return;
				}
			});
			connection.execSql(request);
			//room_idを取得
			var idselect = 'SELECT room_id FROM room';
		});
			/*connection.query(idselect, function(err, resul, fiel) {
				let idSet = new Set();
				for(let re in resul) {
					idSet.add(re.room_id);
				}
				//idが重複していれば新しく作る
				while(idSet.has(id)) id = ('000' + Math.floor(Math.random() * (10000))).slice(-4);
				//追加
				connection.query(insert, [id, req.body.password, req.body.name], function(error, results, fields) {
					if(error){
						res.redirect('signup');
					}else{
						//写真用のフォルダ作成
						fs.mkdir('public/projects/' + id, function (err) {
							if(err) console.log(id + "folder error");
						});
						//使用するビンゴカードの登録(ここではstandard.cssが設定される)
						connection.query(insert_card, [id], function(err, results, fields) {
							if(err) console.log(id + "insert table card error");
						});
						req.session.user = {id: id, name: req.body.name, administrator: true};
						res.redirect('../');
					}
				});
			});*/
		
	}else {
		res.redirect('signup');
	}
});

//管理者のログイン
router.post('/login', function(req, res, next) {
	//入力内容をチェック
	var id = req.body.id;	//id
	var mojisuu = id.length;
	if(mojisuu == 4){
		if(id.match(/[^0-9]+/)){		
			res.render("adminlogin", {title: "Let's BINGO!", error: "IDは4桁の数字のみです。"});
			return;
		}
	}else{
		res.render("adminlogin", {title: "Let's BINGO!", error: "IDは4桁の数字のみです。"})
		return;
	}
	var pass = req.body.password;	//password
	mojisuu = pass.length;
	if(mojisuu >= 8 && mojisuu <= 12){
		if(pass.match(/[^0-9a-z]+/)){
			res.render("adminlogin", {title: "Let's BINGO!", error: "PASSWORDは8桁から12桁の半角英数字のみです。"});
			return;
		}
	}else{	
		res.render("adminlogin", {title: "Let's BINGO!", error: "PASSWORDは8桁から12桁の半角英数字のみです。"});
		return;
	}
	
	connection.query(select, [id, pass], function(error, results, fields) {
		if(error || results.length != 1) {
			res.render('adminlogin', {error: '入力が正しくありません。'});
		} else {
			req.session.user = {id: id, name: results[0].name, administrator: true};
			res.redirect('../');
		}
	});
});

module.exports = router;
