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



app.get('/create-table', function(req, res, next){

	pool.query(create.create_table().Doctor, function(err){
		if(err){
			res.write(JSON.stringify(err));
			console.log(err);
			res.end();
		}else{
			pool.query(create.create_table().Patient, function(err){
				if(err){
						console.log(err);
						res.end();
				}else{
					pool.query(create.create_table().Has, function(err){
						if(err){
							console.log(err);
							res.end();
						}else{
							pool.query(create.create_table().Prescription, function(err){
								if(err){
										console.log(err);
										res.end();			
								}else{
									pool.query(create.create_table().Diagnoses, function(err){
										if(err){
											console.log(err);
											res.end();									
										}else{
											pool.query(create.create_table().Appointment, function(err){
												if(err){
														console.log(err);
														res.end();	
												}else{
													res.render('index');
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});


app.get('/', function(req, res, next){
	res.render('index');
});


/**************************************************************************************
** Doctor paths
***************************************************************************************/

app.get('/doctors', function(req, res, next){
	var context = {};
	var sql = "SELECT * FROM Doctor";
	var sqlData = pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			context.doctor = results;
			res.render('doctors', context);
		}
	})
});

app.post('/add_doctor', function(req, res, next){
	var context = {};
	var sql = "INSERT INTO Doctor (D_name, Phone, Address, Office) VALUES (?, ?, ?, ?)";
	var inserts = [req.body.D_name, req.body.Phone, req.body.Address, req.body.Office];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			context.doctor = results;
			res.redirect('/doctors');
		}
	})
});

app.delete('/delete_doctor/:id', function(req, res, next){
	console.log('got here');
	var sql = "DELETE FROM Doctor WHERE Doctor_id = ?";
	console.log(req.params.id);
	var inserts = [req.params.id];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.status(202).end();
		}
	})


})



/**************************************************************************************
** Patient paths
***************************************************************************************/

app.get('/patients', function(req, res, next){
	var context = {};
	var sql = "SELECT * FROM Doctor";
	var sqlData = pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			console.log(results);
			res.render('patients', context);
		}
	})
});


/**************************************************************************************
** Patient/Doctor Relationship paths
***************************************************************************************/

app.get('/patient-doctor', function(req, res, next){
	res.render('patient-doctor');
});


/**************************************************************************************
** Appointment paths
***************************************************************************************/

app.get('/appointments', function(req, res, next){
	res.render('appointments');
});


/**************************************************************************************
** Diagnoses paths
***************************************************************************************/

app.get('/diagnoses', function(req, res, next){
	res.render('diagnoses');
});

/**************************************************************************************
** Prescription paths
***************************************************************************************/

app.get('/prescriptions', function(req, res, next){
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