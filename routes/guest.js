var express = require('express');
var router = express.Router();

var connection = require('../tediousConnection');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
    async.waterfall([
        (next) => {
            let rows = [];
            let request = new Request(
            'SELECT prize_id, picture_url FROM prize WHERE room_id = @ID ORDER BY priority;',
            (err, rowCount) => {
                next(null, rows);
            });
            request.on('row', function(columns) {
                let row = {};
                columns.forEach(function(column) {
                    row[column.metadata.colName] = column.value;
                });
                rows.push(row);
            });
            request.addParameter('ID', TYPES.NChar, req.session.user.id);
            connection.execSql(request);
        },
        (prizes, next) => {
            let rows = [];
            let request = new Request(
            'SELECT lottery_id FROM room WHERE room_id = @ID;',
            (err, rowCount) => {
                next(null, prizes, rows[0].lottery_id);
            });
            request.on('row', function(columns) {
                let row = {};
                columns.forEach(function(column) {
                    row[column.metadata.colName] = column.value;
                });
                rows.push(row);
            });
            request.addParameter('ID', TYPES.NChar, req.session.user.id);
            connection.execSql(request);
        },
        (prizes, lottery_id, next) => {
            if(lottery_id == 3){    //軽量化版
                next(null, prizes, lottery_id, null);
            }else{
                let rows = [];
                let request = new Request(
                'SELECT card_url FROM card WHERE room_id = @ID;',
                (err, rowCount) => {
                    next(null, prizes, lottery_id, rows[0].card_url);
                });
                request.on('row', function(columns) {
                    let row = {};
                    columns.forEach(function(column) {
                        row[column.metadata.colName] = column.value;
                    });
                    rows.push(row);
                });
                request.addParameter('ID', TYPES.NChar, req.session.user.id);
                connection.execSql(request);
            }
        }],
    (err, prizes, lottery_id, card_url) => {
        if(lottery_id == 3){
        	res.render('bingocardlight', { prizes: prizes });
        }else{
        	res.render('bingocard', { prizes: prizes, style_url: card_url });
        }
    });
});

router.get('/janken', function(req, res, next) {
	res.render('janken_mobile.html');
});

router.get('/nolottery', function(req, res, next) {
	res.render('no_lottery', { userName: req.session.user.name });
});

router.get('/lottery', function(req, res, next) {
	res.render('simple_lottery');
});

router.get('/attack25lottery', function(req, res, next) {
    res.render('景品Attack25参加者.html');
});

module.exports = router;
