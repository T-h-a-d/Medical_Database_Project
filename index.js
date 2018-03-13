var express	= require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();
var create = require('./create_table.js')
var path = require('path');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var root = {root : path.join(__dirname, '/Public')};
var pool = mysql.createPool({
	connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_sautert',
  password        : '0282',
  database        : 'cs340_sautert'
});

app.use(express.static(path.join(__dirname, '/Public')))
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('mysql', mysql);
app.set('port', process.argv[2]);



app.get('/create-table', function(res, req, next){
		create.create_table();
});


app.get('/', function(res, req, next){
	res.render('index');
});


/**************************************************************************************
** Doctor paths
***************************************************************************************/

app.get('/doctors', function(res, req, next){
	res.render('doctors');
});



/**************************************************************************************
** Patient paths
***************************************************************************************/

app.get('/patients', function(res, req, next){
	res.render('patients');
});


/**************************************************************************************
** Patient/Doctor Relationship paths
***************************************************************************************/

app.get('/patient-doctor', function(res, req, next){
	res.render('patient-doctor');
});


/**************************************************************************************
** Appointment paths
***************************************************************************************/

app.get('/appointments', function(res, req, next){
	res.render('appointments');
});


/**************************************************************************************
** Diagnoses paths
***************************************************************************************/

app.get('/diagnoses', function(res, req, next){
	res.render('diagnoses');
});

/**************************************************************************************
** Prescription paths
***************************************************************************************/

app.get('/prescriptions', function(res, req, next){
	res.render('prescriptions');
});



app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Server is up and running ... ');
})