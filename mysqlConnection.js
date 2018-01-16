/*var mysql = require('pg');

var dbConfig = {
	host: 'ec2-54-235-244-185.compute-1.amazonaws.com',
	user: 'tozwceffemspzk',
	password: '5da6c1cc968a378a0d50dcb18ed006418f7d1da596405fd30cefa7610e999115',
	database: 'd59bruvr6nrgsa'
};*/
var pg = require('pg');

var conString = "postgres://tozwceffemspzk:5da6c1cc968a378a0d50dcb18ed006418f7d1da596405fd30cefa7610e999115@ec2-54-235-244-185.compute-1.amazonaws.com:5432/d59bruvr6nrgsa";
var client = new pg.Client(conString);
//var connection = mysql.createConnection(dbConfig);

module.exports = client;
