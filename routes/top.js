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

var deletecard = 'DELETE FROM card WHERE room_id = @ID;';
var deleteprize = 'DELETE FROM prize WHERE room_id = @ID;';
var deleteroom = 'DELETE FROM room WHERE room_id = @ID;';
//ルームを削除する
router.get('/delete', function(req, res, next) {
	// targetRemoveDirectoryPathに消したいディレクトリを指定
	// まずは消したいフォルダの配下ファイルを削除
	var id = req.session.user.id;
	var targetRmDirPath = '../public/projects/' + id;
	var targetRemoveDirectoryPath = targetRmDirPath + '/';
	var targetRemoveFiles = fs.readdirSync(targetRemoveDirectoryPath);
	for (var file in targetRemoveFiles) {
		console.log(targetRemoveFiles[file]);
		fs.unlinkSync(targetRemoveDirectoryPath + targetRemoveFiles[file]);
	}
	// 消したいフォルダを削除
	fs.rmdirSync(targetRmDirPath);

	//データベースを消す
    async.waterfall([
        (next) => {
            let request = new Request(
            deletecard,
            (err, rowCount, rows) => {
                if(err) {
                    next(err);
                } else {
                    next(null);
                }
            });
            request.addParameter('ID', TYPES.NChar, id);
            connection.execSql(request);
        },
        (next) => {
            let request = new Request(
            deleteprize,
            (err, rowCount, rows) => {
                if(err) {
                    next(err);
                } else {
                    next(null);
                }
            });
            request.addParameter('ID', TYPES.NChar, id);
            connection.execSql(request);
        },
        (next) => {
            let request = new Request(
            deleteroom,
            (err, rowCount, rows) => {
                if(err) {
                    next(err);
                } else {
                    next(null);
                }
            });
            request.addParameter('ID', TYPES.NChar, id);
            connection.execSql(request);
        }],
    (err) => {
        if(!err){
            console.log(id + ":delete success");
        }
        res.redirect('/logout');
    });
});

var selectconfig = 'SELECT lottery_id FROM room WHERE room_id = @ID;';
router.get('/other/config', function(req, res, next) {
    let request = new Request(
        selectconfig,
        (err, rowCount) => {
            
        });
    
    request.on('row', (columns) => {
        res.render('その他設定画面', { lottery_id: columns[0].value});
    });
    request.addParameter('ID', TYPES.NChar, req.session.user.id);
    connection.execSql(request);
});

var updateconfig = 'UPDATE room SET lottery_id = @LID WHERE room_id = @ID;';
router.post('/other/submit', function(req, res, next) {
    let request = new Request(
    updateconfig,
    (err, rowCount) => {

    });
    
    request.on('row', (columns) => {
        res.redirect('/manage');
    });
    request.addParameter('LID', TYPES.Int, req.body.or);
    request.addParameter('ID', TYPES.NChar, req.session.user.id);
    connection.execSql(request);
});

module.exports = router;
