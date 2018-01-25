var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MSSQLStore = require('connect-mssql')(session);
var socket_io = require('socket.io');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// html追加
app.engine('html', require('pug').renderFile);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon_48_3.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//socket.io
var io = socket_io();
app.io = io;

var socket = require('./routes/socket/server_socket')(io);

//router
var index = require('./routes/index');
//var users = require('./routes/users');
var administrator = require('./routes/administrator');
var login = require('./routes/login');
var logout = require('./routes/logout');
var guest = require('./routes/guest');
var top = require('./routes/top');
var prize = require('./routes/prize');
var card = require('./routes/card');
var bingo = require('./routes/bingo');

//express-session
//微妙にコンフィグの書き方が違ったのでtediousConnectionと別にしたが、基本は同じ
var config = {
	user: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	database: 'bingo',
	options: { encrypt: true }
};

var sessionMiddleware = session({
	secret: 'secret keykeserasera',
	store: new MSSQLStore(config),	//optionsを省略
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 180 * 60 * 1000	//3時間
	}
});
app.use(sessionMiddleware);

var sessionCheck = function(req, res, next) {
	if(req.session.user)	//セッションの有無をチェック
		next();
	else
		res.redirect('/index');
};

var guestCheck = function(req, res, next) {
	if(req.session.guest)	//ゲスト用のセッションが作られていれば
		next();
	else
		res.redirect('/index');
};

var administratorCheck = function(req, res, next) {
	if(req.session.user.administrator)		//管理者であれば
		next();
	else
		res.redirect('/index');
};

app.use('/index', index);
app.use('/administrator', administrator);
app.use('/login', login);
app.use('/', sessionCheck);
app.use('/logout', logout);
app.use('/guest', guestCheck, guest);
app.use('/', administratorCheck, top);
app.use('/prize', prize);
app.use('/card', card);
app.use('/bingo', bingo);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.use(function(socket, next) {
	if(socket.request) {
		sessionMiddleware(socket.request, socket.request.res, next);
	}else {
		console.log(socket);
	}
});

module.exports = app;
