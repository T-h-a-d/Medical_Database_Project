var express	= require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var root = {root : path.join(__dirname, '/Public')};
var pool = mysql.createPool({
	connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_sautert',
  password        : '0282',
  database        : 'cs340_sautert'
});

app.use(express.static(path.join(__dirname, '/Public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('mysql', mysql);
app.set('port', 3000);

app.get('/', function(){

	

});

app.listen('3000', function(){
	console.log('Server is up and running ... ');
})