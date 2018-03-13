module.exports = {
	create_table: function(res, mysql, context, complete){
		var tables = {
			Doctor: ` CREATE TABLE IF NOT EXISTS Doctor(
			  					Doctor_id INT NOT NULL AUTO_INCREMENT UNIQUE,
           			  D_name VARCHAR(45) NOT NULL,
           			  Phone VARCHAR(45) NOT NULL,
           			  Address VARCHAR(45) NOT NULL,
           			  Office VARCHAR(45) NOT NULL,
           			  PRIMARY KEY (Doctor_id))
           			ENGINE = InnoDB;`,

      Patient: `CREATE TABLE IF NOT EXISTS Patient(
            		  Patient_id INT NOT NULL AUTO_INCREMENT UNIQUE,
            			  P_name VARCHAR(45) NOT NULL,
            			  Birthday DATETIME NOT NULL,
            			  Phone VARCHAR(45) NOT NULL,
            			  Address VARCHAR(45) NOT NULL,
            			  PRIMARY KEY (Patient_id))
            			ENGINE = InnoDB;`,

      Has: `CREATE TABLE IF NOT EXISTS Has(
      			  Patient_id INT NOT NULL,
      			  Doctor_id INT NOT NULL,
      			  PRIMARY KEY (Patient_id, Doctor_id),
      			  CONSTRAINT Patient_id
      			   FOREIGN KEY (Patient_id)
      			   REFERENCES Patient (Patient_id)
      			   ON DELETE NO ACTION
      			   ON UPDATE NO ACTION,
      			  CONSTRAINT Doctor_id
      			    FOREIGN KEY (Doctor_id)
      			    REFERENCES Doctor (Doctor_id)
      			    ON DELETE SET NULL
      			    ON UPDATE NO ACTION)
      			ENGINE = InnoDB;`,

      Prescription: `CREATE TABLE IF NOT EXISTS Prescription(
              			  Prescription_id INT NOT NULL AUTO_INCREMENT,
              			  Drug_name VARCHAR(45) NOT NULL,
              			  Amount INT NOT NULL,
              			  PRIMARY KEY (Prescription_id))
              			ENGINE = InnoDB;`,

       Diagnosis: `CREATE TABLE IF NOT EXISTS Diagnosis(
             			  Diagnosis_id INT NOT NULL AUTO_INCREMENT,
             			  Description TEXT NULL,
             			  Prescription_id INT NULL,
             			  PRIMARY KEY (Diagnosis_id),
             			  INDEX Prescription_id_idx (Prescription_id ASC),
             			  CONSTRAINT Prescription_id
             			    FOREIGN KEY (Prescription_id)
             			    REFERENCES Prescription (Prescription_id)
             			    ON DELETE NO ACTION
             			    ON UPDATE NO ACTION)
             			ENGINE = InnoDB;`,

        Appointment: `CREATE TABLE IF NOT EXISTS Appointment(
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
                			    REFERENCES Patient (Patient_id)
                			    ON DELETE NO ACTION
                			    ON UPDATE NO ACTION,
                			  CONSTRAINT Doctor_id
                			    FOREIGN KEY (Doctor_id)
                			    REFERENCES Doctor (Doctor_id)
                			    ON DELETE NO ACTION
                			    ON UPDATE NO ACTION,
                			  CONSTRAINT Diagnosis_id
                			    FOREIGN KEY (Diagnosis_id)
                			    REFERENCES Diagnosis (Diagnosis_id)
                			    ON DELETE NO ACTION
                			    ON UPDATE NO ACTION)
                			ENGINE = InnoDB;`
		} 
		return(tables);
	}
}