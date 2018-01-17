var express = require('express');
var router = express.Router();

var connection = require('../tediousConnection');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('管理者_ホーム', {id: req.session.user.id, name: req.session.user.name});
});

router.get('/manage', function(req, res, next) {
	res.render('manage.html');
});

var deletecard = 'DELETE FROM card WHERE room_id = ?';
var deleteprize = 'DELETE FROM prize WHERE room_id = ?';
var deleteroom = 'DELETE FROM room WHERE room_id = ?';
//ルームを削除する
router.get('/delete', function(req, res, next) {
	// targetRemoveDirectoryPathに消したいディレクトリを指定
	// まずは消したいフォルダの配下ファイルを削除
	var id = req.session.user.id;
	var targetRmDirPath = 'public/projects/' + id;
	var targetRemoveDirectoryPath = targetRmDirPath + '/';
	var targetRemoveFiles = fs.readdirSync(targetRemoveDirectoryPath);
	for (var file in targetRemoveFiles) {
		console.log(targetRemoveFiles[file]);
		fs.unlinkSync(targetRemoveDirectoryPath + targetRemoveFiles[file]);
	}
	// 消したいフォルダを削除
	fs.rmdirSync(targetRmDirPath);

	//データベースを消す
	connection.query(deletecard, [id], function(error, results) {
		connection.query(deleteprize, [id], function(error, results) {
			connection.query(deleteroom, [id], function(error, results) {
				console.log(id + ":delete success");
			});
		});
	});
	res.redirect('/logout');
});

var selectconfig = 'SELECT lottery_id FROM room WHERE room_id = ?';
router.get('/other/config', function(req, res, next) {
	connection.query(selectconfig, [req.session.user.id], function(error, results) {
		res.render('その他設定画面', { lottery_id: results[0].lottery_id});
	});
});

var updateconfig = 'UPDATE room SET lottery_id = ? WHERE room_id = ?';
router.post('/other/submit', function(req, res, next) {
	connection.query(updateconfig, [req.body.or, req.session.user.id], function(error, result) {
		res.redirect('/manage');
	});
});

module.exports = router;
