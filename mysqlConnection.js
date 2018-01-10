var sql = require('sql');

sql.setDialect('mssql');

var dbConfig = {
	user: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	database: 'bingo',
	options: {enclipt: true}
};

sql.connect(dbConfig, function(err) {
	console.log(err);
	sql.close();
});

var connection = new sql.Request();
module.exports = connection;
