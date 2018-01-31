var express = require('express');
var router = express.Router();

var connection = require('../tediousConnection');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var lottery = 'SELECT lottery_id FROM room WHERE room_id = @ID;';
var sum = 'SELECT SUM(count) AS prizeMax FROM prize WHERE room_id = @ID;';

//ビンゴ
router.get('/', function(req, res, next) {
    let request = new Request(
        sum,
        (err, rowCount) => {
        });
        request.on('row', (columns) => {
            if(columns[0].value == null || columns[0].value == 0){
                res.redirect('../');
            }else{
                res.render('ビンゴ管理側.html');
            }
        });
    request.addParameter('ID', TYPES.NChar, this.id);
	connection.execSql(request);
});
//大画面
router.get('/roulette', function(req, res, next) {
	res.render('ルーレットロゴ', { roomid: req.session.user.id, roomname: req.session.user.name });
});

//じゃんけん
router.get('/janken', function(req, res, next) {
	res.render('janken_pc.html');
});
//大画面
router.get('/jankenscreen', function(req, res, next) {
	res.render('janken_sc.html');
});

//景品抽選
router.get('/lottery', function(req, res, next) {
    let request = new Request(
    lottery,
    (err, rowCount) => {
    });
    
    request.on('row', (columns) => {
        switch(columns[0].value){
    	case 0:	//景品抽選なし
        case 3: //軽量化版
    		res.render('rank_controller.html');
    		break;
    	case 1:	//デフォルト抽選
    		res.render('lottery_controller');
    		break;
    	case 2:	//アタック25
    		res.render('景品Attack25管理側.html');
    		break;
    	}
    });
    request.addParameter('ID', TYPES.NChar, req.session.user.id);
    connection.execSql(request);
});

//景品抽選なし大画面
router.get('/nolotteryscreen', function(req, res, next) {
    res.render('rank_display.html');
});

//景品抽選大画面
router.get('/lotteryscreen', function(req, res, next) {
	res.render('simple_lottery_sc.html');
});

//Attack25大画面
router.get('/attack25screen', function(req, res, next) {
    res.render('景品Attack25.html');
});

module.exports = router;
