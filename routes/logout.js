var express = require('express');
var router = express.Router();

//ログアウト
router.get('/', function(req, res, next) {
	if(req.session.user){
		let logoutView = 'logout_display.html';
		if(req.session.user.administrator){
			logoutView = 'adminlogout.html';
			req.session.destroy();
		}
		res.render(logoutView);
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
