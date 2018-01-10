var Connection = require('tedious').Connection;

var dbConfig = {
	user: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	
	options: {enclipt: true, database: 'bingo'}
};

var connection = new Connection(dbConfig);

//module.exports = connection;

connection.on('connect', function(err) {
	if(err) {
		console.log(err);
	}else {
		console.log("suce");
		connection.close();
	}
});