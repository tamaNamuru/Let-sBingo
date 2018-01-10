var Connection = require('tedious');

var dbConfig = {
	userName: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	options: {enclipt: true, database: 'bingo'}
};

var connection = Connection.createConnection(dbConfig);

module.exports = connection;
