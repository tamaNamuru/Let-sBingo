var tedious = require('tedious').Connection;

var dbConfig = {
	userName: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	options: { encrypt: true, database: 'bingo'}
};

var connection = new tedious(dbConfig);

module.exports = connection;
