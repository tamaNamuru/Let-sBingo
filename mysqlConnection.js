var mysql = require('mysql');

var dbConfig = {
	host: 'sv4.php.xdomain.ne.jp',
	user: 'letsbingo_master',
	password: 'ikkKtmksrsr7',
	database: 'letsbingo_bingo'
};

var connection = mysql.createConnection(dbConfig);

module.exports = connection;
