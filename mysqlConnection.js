var Connection = require('mssql');

var dbConfig = {
	user: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	database: 'bingo',
	options: {enclipt: true}
};

var connection = Connection.createConnection(dbConfig);

module.exports = connection;
