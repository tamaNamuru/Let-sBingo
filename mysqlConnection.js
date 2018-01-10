var sql = require('sql');

sql.setDialect('mssql');

var dbConfig = {
	user: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	database: 'bingo',
	options: {enclipt: true}
};

mssql.connect(dbConfig, function(err) {
	console.log(err);
	sql.close();
});

var connection = new mssql.Request();
module.exports = connection;
