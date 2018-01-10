var Connection = require('tedious').Connection;

var dbConfig = {
	userName: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	
	options: {enclipt: true, database: 'bingo'}
};

var connection = new Connection(dbConfig);

//module.exports = connection;

connection.on('connect', function(err) {
	console.log("Connected");
	executeStatement();
});
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;

function executeStatement() {
	request = new Request("SELECT * FROM room;",function(err) {
		if(err) {
			console.log(err);
		}
	});
	var result = "";
	request.on('row', function(columns) {
		columns.forEach(function(column) {
			if (column.value === null) {
				console.log('NULL');
			} else {
				result+= column.value + " ";
			}
		});
		console.log(result);
		result = "";
	});
	request.on('done', function(rowCount, more) {  
        	console.log(rowCount + ' rows returned');  
        });  
        connection.execSql(request);  
}