var express = require('express');
var router = express.Router();

var connection = require('../tediousConnection');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');

var select = 'SELECT name, count, picture_url, description, priority FROM prize WHERE room_id = @ID ORDER BY priority;';
var drop = 'DELETE FROM prize WHERE room_id = @ID';
var insert = 'INSERT INTO prize(room_id, prize_id, name, priority, description, picture_url, count) VALUES @Values;';

var insert2 = 'INSERT INTO prize(room_id, prize_id, name, priority, description, picture_url, count) VALUES (@Values);';
var multer  = require('multer')
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, '../public/projects/' + req.session.user.id + '/');
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});
var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('showGoods.html');
});

router.get('/show', function(req, res, next) {
	let request = new Request(
		select,
		(err, rowCount, rows) => {
			console.log(rows);
			res.render('reading', { prizes: rows });
		});
	request.addParameter('ID', TYPES.NChar, req.session.user.id);
	connection.execSql(request);
});

router.get('/info', function(req, res, next) {
	let request = new Request(
		select,
	        (err, rowCount, rows) => {
			console.log(rows);
			res.render('keihin_joho', { prizes: rows });
	        });
	request.addParameter('ID', TYPES.NChar, req.session.user.id);
	connection.execSql(request);
});

router.post('/insert', upload.array('pic'), function(req, res, next) {
	console.log(req.body);
	console.log(req.files);
	let id = req.session.user.id;
	
	//テーブルの内容を消す
    async.waterfall([
        (next) => {
            let request = new Request(
            drop,
            (err, rowCount, rows) => {
                if(err) {
                    next(err);
                } else {
                    let values = [];
                    let pattern = "/" + id + "/";
                    if(Array.isArray(req.body.name)){
                        //写真のインデックス
                        let fileIndex = -1;
                        if(Array.isArray(req.files)) fileIndex = 0;
                        for(let i=0; i < req.body.name.length; i++){
                            if(!req.body.name) continue;

                            let name = req.body.name[i];
                            let count = req.body.kazu[i];
                            let url = null;
                            if(req.body.url[i]){
                                url = req.body.url[i];
                                console.log(url);

                                if(url.indexOf(pattern) == -1) {
                                    if(fileIndex >= 0) url = "/projects/" + id + "/" + req.files[fileIndex++].originalname;
                                    else url = "/projects/" + id + "/" + req.files[0].originalname;
                                }
                                console.log(url);
                            }
                            let desc = req.body.biko[i];
                            let pri = req.body.pri[i];
                            values.push([id, i+1, name, pri, desc, url, count]);
                        }
                    } else {	//レコードが一つのみ
                        let url = null;
                        if(req.body.url){
                            url = req.body.url;
                            if(url.indexOf(pattern) == -1) {
                                url = "/projects/" + id + "/" + req.files[0].originalname;
                            }
                        }
                        values.push([id, 1, req.body.name, req.body.pri, req.body.biko, url, req.body.kazu]);
                    }
                    let tables = {
                        columns: [
                            {name: 'room_id', type: TYPES.NChar},
                            {name: 'prize_id', type: TYPES.Int},
                            {name: 'name', type: TYPES.NVarChar},
                            {name: 'priority', type: TYPES.Int},
                            {name: 'description', type: TYPES.NVarChar},
                            {name: 'picture_url', type: TYPES.NVarChar},
                            {name: 'count', type: TYPES.Int}
                        ],
                        rows: values
                    };
                    console.log(tables);
                    next(null, tables);
                }
            });
            request.addParameter('ID', TYPES.NChar, id);
            connection.execSql(request);
        },
        (tables, next) => {
            let request = new Request(
            insert2,
            (err, rowCount, rows) => {
                if(err) {
                    next(err);
                } else {
                    next(null);
                }
            });
            request.addParameter('Values', TYPES.TVP, tables);
            console.log(request);
            connection.callProcedure(request);
        }],
    (err) => {
        if(err){
            console.log("insert error");
        }
        res.redirect('show');
    });
});

module.exports = router;
