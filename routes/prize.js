var express = require('express');
var router = express.Router();

var connection = require('../tediousConnection');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');

var select = 'SELECT name, count, picture_url, description, priority FROM prize WHERE room_id = @ID ORDER BY priority;';
var drop = 'DELETE FROM prize WHERE room_id = @ID';

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
    let rows = [];
	let request = new Request(
		select,
		(err, rowCount) => {
			res.render('reading', { prizes: rows });
		});
    
    request.on('row', function(columns) {
        var row = {};
        columns.forEach(function(column) {
            row[column.metadata.colName] = column.value;
        });
        rows.push(row);
    });
	request.addParameter('ID', TYPES.NChar, req.session.user.id);
	connection.execSql(request);
});

router.get('/info', function(req, res, next) {
    let rows = [];
	let request = new Request(
		select,
	        (err, rowCount) => {
			res.render('keihin_joho', { prizes: rows });
	        });
    request.on('row', function(columns) {
        var row = {};
        columns.forEach(function(column) {
            row[column.metadata.colName] = column.value;
        });
        rows.push(row);
    });
	request.addParameter('ID', TYPES.NChar, req.session.user.id);
	connection.execSql(request);
});

router.post('/insert', upload.array('pic'), function(req, res, next) {
    if(!req.body.name){
        res.redirect('info');
        return;
    }
	let id = req.session.user.id;
	
	//テーブルの内容を消す
    async.waterfall([
        (next) => {
            let request = new Request(
            drop,
            (err, rowCount) => {
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

                                if(url.indexOf(pattern) == -1) {
                                    if(fileIndex >= 0) url = "/projects/" + id + "/" + req.files[fileIndex++].originalname;
                                    else url = "/projects/" + id + "/" + req.files[0].originalname;
                                }
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
                    next(null, values);
                }
            });
            request.addParameter('ID', TYPES.NChar, id);
            connection.execSql(request);
        },
        (values, next) => {
            let insert = 'INSERT INTO prize(room_id, prize_id, name, priority, description, picture_url, count) VALUES';
            for(let i = 0; i < values.length; i++) {
                insert = insert + '(@rid' + i + ', @pid' + i + ', @name' + i + ', @yuusen' + i + ', @setumei' + i + ', @purl' + i + ', @count' + i + ')';
                if(i < values.length - 1) {
                    insert+= ',';
                }
            }
            insert+= ';';
            
            let request = new Request(
            insert,
            (err, rowCount) => {
                if(err) {
                    next(err);
                } else {
                    next(null);
                }
            });
            for(let i = 0; i < values.length; i++) {
                request.addParameter('rid' + i, TYPES.NChar, values[i][0]);
                request.addParameter('pid' + i, TYPES.NChar, values[i][1]);
                request.addParameter('name' + i, TYPES.NVarChar, values[i][2]);
                request.addParameter('yuusen' + i, TYPES.Int, values[i][3]);
                request.addParameter('setumei' + i, TYPES.NVarChar, values[i][4]);
                request.addParameter('purl' + i, TYPES.NVarChar, values[i][5]);
                request.addParameter('count' + i, TYPES.Int, values[i][6]);
            }
            connection.execSql(request);
        }],
    (err) => {
        if(err){
            console.log(err);
            console.log("負けないで！ケセラセラの精神よ！");
        }
        res.redirect('show');
    });
});

module.exports = router;
