var express = require('express');
var router = express.Router();

var connection = require('../tediousConnection');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');

var select = 'SELECT name FROM room WHERE room_id = @ID AND password = @Password;';

var nameselect = 'SELECT name FROM room WHERE name = @Name;';
var idselect = 'SELECT room_id FROM room;';
var insert = 'INSERT INTO room(room_id, password, name) VALUES(@ID, @Password, @Name);';
var insert_card = "INSERT INTO card(room_id) VALUES(@ID);";

var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('adminlogin', {title: "Let's BINGO!"});
});

router.get('/signup', function(req, res, next) {
	res.render('新規作成画面');
});

//新規登録
router.post('/signup', function(req, res, next) {
	//入力されているかのチェックなくてもいい
	if(!req.body.name || !req.body.password){
        res.redirect('signup');
        return;
    }
    let id = ('000' + Math.floor(Math.random() * (10000))).slice(-4);
    async.waterfall([
        (next) => {
            //データベースに登録
            request = new Request(
            nameselect,
            (err, rowCount, rows) => {
                if(err || rowCount > 0) {
                    res.render('新規作成画面', { error: "すでに同じ名前の部屋があります。"});
                    return;
                } else {
                    next(null);
                }
            });
            request.addParameter('Name', TYPES.NVarChar, req.body.name);
            connection.execSql(request);
        },
        (next) => {
            //room_idを取得
            request = new Request(idselect,
            (err, rowCount, rows) => {
                if(err) {
                    next(err);
                } else {
                    let idSet = new Set();
                    for(let re in rows) {
                        idSet.add(re.room_id);
                    }
                    //idが重複していれば新しく作る
                    while(idSet.has(id)) id = ('000' + Math.floor(Math.random() * (10000))).slice(-4);
                    next(null);
                }
            });
            connection.execSql(request);
        },
        (next) => {
            //追加
             //room_idを取得
            request = new Request(insert,
            (err, rowCount, rows) => {
                if(err) {
                    next(err);
                } else {
                    next(null);
                }
            });
            request.addParameter('ID', TYPES.NChar, id);
            request.addParameter('Password', TYPES.NVarChar, req.body.password);
            request.addParameter('Name', TYPES.NVarChar, req.body.name);
            connection.execSql(request);
        },
        (next) => {
            //写真用のフォルダ作成
            fs.mkdir('../public/projects/' + id, function (err) {
                if(err) console.log(id + "folder error");
            });
            //使用するビンゴカードの登録(ここではstandard.cssが設定される)
            request = new Request(insert_card,
            (err, rowCount, rows) => {
                if(err) {
                    console.log(id + "insert table card error");
                    next(err);
                } else {
                    next(null);
                }
            });
            request.addParameter('ID', TYPES.NChar, id);
            connection.execSql(request);                    
        }],
        (err) => {
            if(err){
                res.redirect('signup');
            }else{
                req.session.user = {id: id, name: req.body.name, administrator: true};
                res.redirect('../');
            }
        }
    );
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
	
    request = new Request(
        select,
        (err, rowCount, rows) => {
            if(err || rowCount != 1) {
                res.render('adminlogin', {error: '入力が正しくありません。'});
            }else {
            	res.redirect('../');
            }
        });
    request.on('row', (columns) =>{
        if(columns.length == 1) {
            req.session.user = {id: id, name: columns[0].value, administrator: true};
            
        }
    });
    request.addParameter('ID', TYPES.NChar, id);
    request.addParameter('Password', TYPES.NVarChar, pass);
    connection.execSql(request);
});

module.exports = router;
