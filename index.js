var express	= require('express');
var url = require('url');
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

app.get('/reset-table', function(req, res, next){
	pool.query(create.reset_table().Has, function(err){
		if(err){
			console.log(err);
			res.end();
		}else{
			pool.query(create.reset_table().Appointment, function(err){
				if(err){
					console.log(err);
					res.end();
				}else{
					pool.query(create.reset_table().Doctor, function(err){
						if(err){
							console.log(err);
							res.end();
						}else{
							pool.query(create.reset_table().Patient, function(err){
								if(err){
									console.log(err);
									res.end();
								}else{
									pool.query(create.reset_table().Diagnosis, function(err){
										if(err){
											console.log(err);
											res.end();
										}else{
											pool.query(create.reset_table().Prescription, function(err){
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
									pool.query(create.create_table().Diagnosis, function(err){
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
	var sql = "DELETE FROM Doctor WHERE Doctor_id = ?";
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
	var sql = "SELECT * FROM Patient";
	var sqlData = pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			context.patient = results;
			res.render('patients', context);
		}
	})
});

app.post('/add_patient', function(req, res, next){
	var context = {};
	var sql = "INSERT INTO Patient (P_name, Birthday, Phone, Address) VALUES (?, ?, ?, ?)";
	var inserts = [req.body.P_name, req.body.Birthday, req.body.Phone, req.body.Address];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			context.doctor = results;
			res.redirect('/patients');
		}
	})
});

app.delete('/delete_patient/:id', function(req, res, next){
	var sql = "DELETE FROM Patient WHERE Patient_id = ?";
	var inserts = [req.params.id];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.status(202).end();
		}
	});
})


/**************************************************************************************
** Patient/Doctor Relationship paths
***************************************************************************************/

app.get('/patient-doctor', function(req, res, next){
	var context = {};
	var sql = "SELECT * FROM Has INNER JOIN Patient ON Has.Patient_id = Patient.patient_id INNER JOIN Doctor ON Has.Doctor_id = Doctor.Doctor_id";
	var sqlData = pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			context.patient_doctor = results;
			var sql = "SELECT * FROM Patient";
			var sqlData = pool.query(sql, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					console.log(error);
					res.end();	
				}else{
					context.patient_name = results;
					var sql = "SELECT * FROM Doctor";
					var sqlData = pool.query(sql, function(error, results, fields){
						if(error){
							res.write(JSON.stringify(error));
							console.log(error);
							res.end();								
						}else{
							context.doctor_name = results;
							res.render('patient-doctor', context);
						}
					})
				}
			})
		}
	})
});

app.post('/add_patient_doctor', function(req, res, next){
	var context = {};
	var sql = "INSERT INTO Has (Patient_id, Doctor_id) VALUES (?, ?)"
	var inserts = [req.body.Patient_id, req.body.Doctor_id];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.redirect('/patient-doctor');
		}
	})
});

app.delete('/delete_patient_doctor', function(req, res, next){
	var sql = "DELETE FROM Has WHERE Patient_id = ? AND Doctor_id = ?";
	var inserts = [req.body.p_id, req.body.d_id];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.status(202).end();
		}
	});
})


/**************************************************************************************
** Appointment paths
***************************************************************************************/

app.get('/appointments', function(req, res, next){
	var context = {};
	var sql = "SELECT * FROM Appointment INNER JOIN Doctor ON Appointment.Doctor_id = Doctor.Doctor_id INNER JOIN Patient ON Appointment.Patient_id = Patient.Patient_id";
	var sqlData = pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			context.appointment = results;
			sql = "SELECT * FROM Doctor";
			pool.query(sql, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					console.log(error);
					res.end();
				}else{
					context.D_name = results;
					sql = "SELECT * FROM Patient"
					pool.query(sql, function(error, results, fields){
						if(error){
							res.write(JSON.stringify(error));
							console.log(error);
							res.end();
						}else{
							context.P_name = results;
							res.render('appointments', context);
						}
					})
				}
			})
		}
	});
});

app.post('/add_appointment', function(req, res, next){
	var context = {};

	var sql = "INSERT INTO Appointment (Patient_id, Doctor_id, Visit_reason, Date) VALUES (?, ?, ?, ?)"
	var inserts = [req.body.Patient_id, req.body.Doctor_id, req.body.Visit_reason, req.body.Date];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.redirect('/appointments');
		}
	})
});

app.delete('/delete_appointment/:id', function(req, res, next){
	var sql = "DELETE FROM Appointment WHERE App_id = ?";
	var inserts = [req.params.id];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.status(202).end();
		}
	});
})


/**************************************************************************************
** Diagnoses paths
***************************************************************************************/

app.get('/diagnoses', function(req, res, next){
	var context = {};
	context.appointment_search = req.query;
	var sql = "SELECT * FROM Diagnosis INNER JOIN Appointment ON Diagnosis.Diagnosis_id = Appointment.Diagnosis_id" 
							+ " INNER JOIN Patient ON Appointment.Patient_id = Patient.Patient_id" 
								+ " INNER JOIN Doctor ON Appointment.Doctor_id = Doctor.Doctor_id";
	var sqlData = pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			context.diagnosis = results;
			var sql = "SELECT * FROM Diagnosis";
			pool.query(sql, function(err, results, fields){
				if(err){
					res.write(JSON.stringify(err));
					console.log(err);
					res.end();
				}else{
				 context.appointment = results;

				 res.render('diagnoses', context);
				}
			})
		}
	})
});

app.post('/add_diagnosis', function(req, res, next){
	var context = {};
	console.log(req.body);
	var sql = "INSERT INTO Diagnosis (Description) VALUES (?)";
	var inserts = [req.body.Description];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			context.Diagnosis_id = results.insertId;
			var sql = "UPDATE Appointment SET Diagnosis_id = ? WHERE App_id = ?";
			var insert = [context.Diagnosis_id, req.body.App_id]
			pool.query(sql, insert, function(error, results, fields){
				if(error){
						res.write(JSON.stringify(error));
						console.log(error);
						res.end();
				}else{
					res.redirect('/diagnoses');
				}
			})
		}
	})
});

app.delete('/delete_diagnosis/:id', function(req, res, next){
	var sql = "DELETE FROM Diagnosis WHERE Diagnosis_id = ?";
	var inserts = [req.params.id];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.status(202).end();
		}
	});
})

app.get('/find_appointment/:search', function(req, res, next){
	var context = {};
	var sql = "SELECT * FROM Appointment" 
						+ " INNER JOIN Patient ON Appointment.Patient_id = Patient.Patient_id"  
							+ " INNER JOIN Doctor ON Appointment.Doctor_id = Doctor.Doctor_id" 
								+ " LEFT JOIN Diagnosis ON Appointment.Diagnosis_id = Diagnosis.Diagnosis_id"
									+ " WHERE P_name LIKE ? OR D_name LIKE ?";
	var inserts = ['%' + req.params.search + '%', '%' + req.params.search + '%'];
	pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.send(results);
		}
	});
});



/**************************************************************************************
** Prescription paths
***************************************************************************************/

app.get('/prescriptions', function(req, res, next){
	var context = {};
	context.appointment_search = req.query;
	var sql = "SELECT * FROM Prescription" 
							+ " INNER JOIN Diagnosis ON Prescription.Prescription_id = Diagnosis.Prescription_id" 
								+ " INNER JOIN Appointment ON Diagnosis.Diagnosis_id = Appointment.Diagnosis_id" 
									+ " INNER JOIN Patient ON Appointment.Patient_id = Patient.Patient_id"
										+ " INNER JOIN Doctor ON Appointment.Doctor_id = Doctor.Doctor_id";
	var sqlData = pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			context.prescription = results
			res.render('prescriptions', context);
				}
		});
});



app.post('/add_prescription', function(req, res, next){
	var context = {};
	var sql = "INSERT INTO Prescription (Drug_name, Amount) VALUES (?, ?)";
	var inserts = [req.body.Drug_name, req.body.Amount];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			context.Prescription_id = results.insertId;
			var sql = "UPDATE Diagnosis SET Prescription_id = ? WHERE Diagnosis_id = ?";
			var insert = [context.Prescription_id, req.body.Diagnosis_id];
			pool.query(sql, insert, function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					console.log(error);
					res.end();
				}else{
					res.redirect('/prescriptions');
				}
			})
		}
	})
});

app.delete('/delete_prescription/:id', function(req, res, next){
	var sql = "DELETE FROM Prescription WHERE Prescription_id = ?";
	var inserts = [req.params.id];
	var sqlData = pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.status(202).end();
		}
	});
})

app.get('/find_appointment_diagnosis/:search', function(req, res, next){
	var context = {};
	var sql = "SELECT * FROM Appointment" 
						+ " INNER JOIN Patient ON Appointment.Patient_id = Patient.Patient_id"  
							+ " INNER JOIN Doctor ON Appointment.Doctor_id = Doctor.Doctor_id" 
								+ " INNER JOIN Diagnosis ON Appointment.Diagnosis_id = Diagnosis.Diagnosis_id"
									+ " LEFT JOIN Prescription ON Diagnosis.Prescription_id = Prescription.Prescription_id"
										+ " WHERE P_name LIKE ? OR D_name LIKE ?";
	var inserts = ['%' + req.params.search + '%', '%' + req.params.search + '%'];
	pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.send(results);
		}
	});
});

/**************************************************************************************
** Search Queries
***************************************************************************************/

app.get('/find_appointment_date', function(req, res, next){

	if(!req.query.date){
		var sql = "SELECT * FROM Appointment" 
			+ " INNER JOIN Patient ON Appointment.Patient_id = Patient.Patient_id"  
				+ " INNER JOIN Doctor ON Appointment.Doctor_id = Doctor.Doctor_id" 
					+ " WHERE P_name LIKE ? OR D_name LIKE ?";
		var inserts = ['%' + req.query.search_name + '%', '%' + req.query.search_name + '%'];
	}

	else if(!req.query.search_name){
		console.log('Search is null');
		var sql = "SELECT * FROM Appointment" 
							+ " INNER JOIN Patient ON Appointment.Patient_id = Patient.Patient_id"  
								+ " INNER JOIN Doctor ON Appointment.Doctor_id = Doctor.Doctor_id" 
									+ " WHERE Date = ?";
		var inserts = [req.query.date];
	}

	else{
		console.log('Both forms are filled');
		var sql = "SELECT * FROM Appointment" 
							+ " INNER JOIN Patient ON Appointment.Patient_id = Patient.Patient_id"  
								+ " INNER JOIN Doctor ON Appointment.Doctor_id = Doctor.Doctor_id" 
									+ " WHERE Date = ? AND (P_name LIKE ? OR D_name LIKE ?)";
		var inserts = [req.query.date, '%' + req.query.search_name + '%', '%' + req.query.search_name + '%'];
	}

	pool.query(sql, inserts, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			console.log(error);
			res.end();
		}else{
			res.send(results);
		}
	});
});

/**************************************************************************************
** Error paths
***************************************************************************************/

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