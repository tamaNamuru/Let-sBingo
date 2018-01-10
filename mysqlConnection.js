var Connection = require('tedious').Connection;

var dbConfig = {
	userName: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	options: {enclipt: true, database: 'bingo'}
};

var connection = new Connection(config);

connection.on('connect', function(err) {
	console.log("Connected");
});
module.exports = connection;
