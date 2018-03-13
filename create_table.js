module.exports = {
	create_table: function(res, mysql, context, complete){
		var tables = `
			CREATE TABLE IF NOT EXISTS Medical_DB.Doctor (
			  Doctor_id INT NOT NULL AUTO_INCREMENT,
			  D_name VARCHAR(45) NOT NULL,
			  Phone VARCHAR(45) NOT NULL,
			  Address VARCHAR(45) NOT NULL,
			  Office VARCHAR(45) NOT NULL,
			  PRIMARY KEY (Doctor_id))
			ENGINE = InnoDB;
			
			CREATE TABLE IF NOT EXISTS Medical_DB.Patient (
			  Patient_id INT NOT NULL AUTO_INCREMENT,
			  P_name VARCHAR(45) NOT NULL,
			  Birthday DATETIME NOT NULL,
			  Phone VARCHAR(45) NOT NULL,
			  Address VARCHAR(45) NOT NULL,
			  PRIMARY KEY (Patient_id))
			ENGINE = InnoDB;
			
			CREATE TABLE IF NOT EXISTS Medical_DB.Has (
			  Patient_id INT NOT NULL,
			  Doctor_id INT NOT NULL,
			  PRIMARY KEY (Patient_id, Doctor_id),
			  CONSTRAINT Patient_id
			    FOREIGN KEY ()
			    REFERENCES Medical_DB.Patient ()
			    ON DELETE NO ACTION
			    ON UPDATE NO ACTION,
			  CONSTRAINT Doctor_id
			    FOREIGN KEY (Patient_id , Doctor_id)
			    REFERENCES Medical_DB.Doctor (Doctor_id , Doctor_id)
			    ON DELETE SET NULL
			    ON UPDATE NO ACTION)
			ENGINE = InnoDB;
			
			CREATE TABLE IF NOT EXISTS Medical_DB.Prescription (
			  Prescription_id INT NOT NULL AUTO_INCREMENT,
			  Drug_name VARCHAR(45) NOT NULL,
			  Amount INT NOT NULL,
			  PRIMARY KEY (Prescription_id))
			ENGINE = InnoDB;
			
			
			CREATE TABLE IF NOT EXISTS Medical_DB.Diagnosis (
			  Diagnosis_id INT NOT NULL AUTO_INCREMENT,
			  Description TEXT NULL,
			  Prescription_id INT NULL,
			  PRIMARY KEY (Diagnosis_id),
			  INDEX Prescription_id_idx (Prescription_id ASC),
			  CONSTRAINT Prescription_id
			    FOREIGN KEY (Prescription_id)
			    REFERENCES Medical_DB.Prescription (Prescription_id)
			    ON DELETE NO ACTION
			    ON UPDATE NO ACTION)
			ENGINE = InnoDB;
			
			CREATE TABLE IF NOT EXISTS Medical_DB.Appointment (
			  App_id INT NOT NULL AUTO_INCREMENT,
			  Visit_reason TEXT NOT NULL,
			  Patient_id INT NOT NULL,
			  Doctor_id INT NOT NULL,
			  Date DATETIME NOT NULL,
			  Diagnosis_id INT NOT NULL,
			  PRIMARY KEY (App_id),
			  INDEX Doctor_id_idx (Doctor_id ASC),
			  INDEX Patient_id_idx (Patient_id ASC),
			  INDEX Diagnosis_id_idx (Diagnosis_id ASC),
			  CONSTRAINT Patient_id
			    FOREIGN KEY (Patient_id)
			    REFERENCES Medical_DB.Patient (Patient_id)
			    ON DELETE NO ACTION
			    ON UPDATE NO ACTION,
			  CONSTRAINT Doctor_id
			    FOREIGN KEY (Doctor_id)
			    REFERENCES Medical_DB.Doctor (Doctor_id)
			    ON DELETE NO ACTION
			    ON UPDATE NO ACTION,
			  CONSTRAINT Diagnosis_id
			    FOREIGN KEY (Diagnosis_id)
			    REFERENCES Medical_DB.Diagnosis (Diagnosis_id)
			    ON DELETE NO ACTION
			    ON UPDATE NO ACTION)
			ENGINE = InnoDB;
		`;

		pool.query(tables, function(err){
			if(err){
				res.write(JSON.stringify(err));
				console.log(err);
				res.end();
			}else{
				res.render('index');
			}
		})
	}
}