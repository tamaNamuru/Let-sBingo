var express = require('express');
var router = express.Router();

var connection = require('../mysqlConnection');
var lottery = 'SELECT lottery_id FROM room WHERE room_id = ?';

//ビンゴ
router.get('/', function(req, res, next) {
	res.render('ビンゴ管理側.html');
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
    //res.render('lottery_controller');
    //res.render('景品Attack25管理側.html');
    connection.query(lottery, [req.session.user.id], function(error, result) {
    	switch(result[0].lottery_id){
    	case 0:	//景品抽選なし
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
});

//景品抽選なし大画面
router.get('/nolotteryscreen', function(req, res, next) {
    res.render('rank_display.html');
});

//景品抽選大画面
router.get('/lotteryscreen', function(req, res, next) {
	res.render('katoP_sc.html');
});

//Attack25大画面
router.get('/attack25screen', function(req, res, next) {
    res.render('景品Attack25.html');
});

module.exports = router;
