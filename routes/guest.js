var express = require('express');
var router = express.Router();

var connection = require('../mysqlConnection');

/* GET home page. */
router.get('/', function(req, res, next) {
	connection.query('SELECT prize_id, picture_url FROM prize WHERE room_id = ? ORDER BY priority', [req.session.user.id], function(error, result_pri) {
		if(error) console.log("prize select error");
		connection.query('SELECT card_url FROM card WHERE room_id = ?', [req.session.user.id], function(error, result_card) {
			res.render('bingocard', { prizes: result_pri, style_url: result_card[0].card_url });
		});
	});
});

router.get('/janken', function(req, res, next) {
	res.render('janken_mobile.html');
});

router.get('/nolottery', function(req, res, next) {
	res.render('no_lottery');
});

router.get('/lottery', function(req, res, next) {
	res.render('simple_lottery');
});

router.get('/attack25lottery', function(req, res, next) {
    res.render('景品Attack25参加者.html');
});

module.exports = router;
