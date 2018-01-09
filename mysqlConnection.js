var mysql = require('mysql');

var dbConfig = {
	host: 'localhost',
	user: 'master',
	password: 'pass',
	database: 'bingo'
};

var connection = mysql.createConnection(dbConfig);

module.exports = connection;
