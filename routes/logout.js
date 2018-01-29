var express = require('express');
var router = express.Router();
var connection = require('../tediousConnection');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var delete_sessions = 'delete from sessions where session like @room_id';
//ログアウト
router.get('/', function(req, res, next) {
	if(req.session.user){
		
		if(req.session.user.administrator){
			let request = new Request(
			delete_sessions,
			(err, rowCount) => {
				req.session.destroy();
				res.render('adminlogout.html');
			});
			request.addParameter('room_id', TYPES.NVarChar, '%"id":"' + req.session.user.id + '"%');
			connection.execSql(request);
		}else {
			res.render('logout_display.html');
		}
	}else
		res.redirect('/index');
});

router.get('/userexit', function(req, res, next) {
    if(req.session.user){
        req.session.destroy();  //セッションを削除する
		res.render('logout_display.html');
	}else
		res.redirect('/index');
});
module.exports = router;
