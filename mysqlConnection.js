var mssql = require('mssql');

var dbConfig = {
	user: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	database: 'bingo',
	options: {enclipt: true}
};

mssql.connect(dbConfig, function(err) {
	console.log(err);
	mssql.close();
});

var connection = new mssql.Request();
module.exports = connection;
