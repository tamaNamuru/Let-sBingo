var mysql = require('mysql');

var dbConfig = {
	host: 'keserasera.database.windows.net',
	user: 'master',
	password: 'ikkKtmksrsr7',
	database: 'bingo'
};

var connection = mysql.createConnection(dbConfig);

module.exports = connection;
