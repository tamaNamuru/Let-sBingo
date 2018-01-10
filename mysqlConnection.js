var Connection = require('tedious').Connection;

var dbConfig = {
	userName: 'master',
	password: 'ikkKtmksrsr7',
	server: 'keserasera.database.windows.net',
	
	options: {encrypt: true, database: 'bingo'}
};

var connection = new Connection(dbConfig);

//module.exports = connection;

/*connection.on('connect', function(err) {
if(err) console.log(err);
else{
	//console.log("Connected");
	//executeStatement();
}
});*/
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;

/*function executeStatement() {
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
}*/
connection.on('connect', function(er) {
	request = new Request('SELECT name FROM room WHERE name = @name;', function(e) {
	});
	request.addParameter('name', TYPES.VarChar, 'tama');
	request.on('row', function(columns) {
		if(columns.value != null) {
			//res.render('新規作成画面', { error: "すでに同じ名前の部屋があります。"});
			return;
		}
	});
	connection.execSql(request);
	console.log("namuru");
});