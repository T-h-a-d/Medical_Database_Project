module.exports = {
	create_table: function(){
		var tables = {
			Doctor: ` CREATE TABLE Doctor(
			  					Doctor_id INT NOT NULL AUTO_INCREMENT UNIQUE,
           			  D_name VARCHAR(45) NOT NULL,
           			  Phone VARCHAR(45) NOT NULL,
           			  Address VARCHAR(45) NOT NULL,
           			  Office VARCHAR(45) NOT NULL,
           			  PRIMARY KEY (Doctor_id))
           			ENGINE = InnoDB;`,

      Patient: `CREATE TABLE Patient(
            		  Patient_id INT NOT NULL AUTO_INCREMENT UNIQUE,
            			  P_name VARCHAR(45) NOT NULL,
            			  Birthday DATETIME NOT NULL,
            			  Phone VARCHAR(45) NOT NULL,
            			  Address VARCHAR(45) NOT NULL,
            			  PRIMARY KEY (Patient_id))
            			ENGINE = InnoDB;`,

      Has: `CREATE TABLE Has(
      			  Patient_id INT NOT NULL,
      			  Doctor_id INT NOT NULL,
      			  PRIMARY KEY (Patient_id, Doctor_id),
      			  CONSTRAINT Patient_id
      			   FOREIGN KEY (Patient_id)
      			   REFERENCES Patient (Patient_id)
      			   ON DELETE CASCADE
      			   ON UPDATE NO ACTION,
      			  INDEX Doctor_id_idx (Doctor_id ASC),
      			  CONSTRAINT Doctor_id
      			    FOREIGN KEY (Doctor_id)
      			    REFERENCES Doctor (Doctor_id)
      			    ON DELETE CASCADE
      			    ON UPDATE NO ACTION)
      			ENGINE = InnoDB;`,

      Prescription: `CREATE TABLE Prescription(
              			  Prescription_id INT NOT NULL AUTO_INCREMENT,
              			  Drug_name VARCHAR(45) NOT NULL,
              			  Amount INT NOT NULL,
              			  PRIMARY KEY (Prescription_id))
              			ENGINE = InnoDB;`,

       Diagnosis: `CREATE TABLE Diagnosis(
             			  Diagnosis_id INT NOT NULL AUTO_INCREMENT,
             			  Description TEXT NOT NULL,
             			  Prescription_id INT NULL,
             			  PRIMARY KEY (Diagnosis_id),
             			  INDEX Prescription_id_idx (Prescription_id ASC),
             			  CONSTRAINT Prescription_id
             			    FOREIGN KEY (Prescription_id)
             			    REFERENCES Prescription (Prescription_id)
             			    ON DELETE SET NULL
             			    ON UPDATE NO ACTION)
             			ENGINE = InnoDB;`,

        Appointment: `CREATE TABLE Appointment(
                			  App_id INT NOT NULL AUTO_INCREMENT,
                			  Visit_reason TEXT NOT NULL,
                			  Patient_id INT NOT NULL,
                			  Doctor_id INT NOT NULL,
                			  Date DATETIME NOT NULL,
                			  Diagnosis_id INT,
                			  PRIMARY KEY (App_id),
                			  INDEX Doctor_id_idx (Doctor_id ASC),
                			  INDEX Patient_id_idx (Patient_id ASC),
                			  INDEX Diagnosis_id_idx (Diagnosis_id ASC),
                			  CONSTRAINT Patient_id_app
                			    FOREIGN KEY (Patient_id)
                			    REFERENCES Patient (Patient_id)
                			    ON DELETE CASCADE
                			    ON UPDATE NO ACTION,
                			  CONSTRAINT Doctor_id_app
                			    FOREIGN KEY (Doctor_id)
                			    REFERENCES Doctor (Doctor_id)
                			    ON DELETE CASCADE
                			    ON UPDATE NO ACTION,
                			  CONSTRAINT Diagnosis_id_app
                			    FOREIGN KEY (Diagnosis_id)
                			    REFERENCES Diagnosis (Diagnosis_id)
                			    ON DELETE SET NULL
                			    ON UPDATE NO ACTION)
                			ENGINE = InnoDB;`
		} 
		return(tables);
	},

  reset_table: function(){
    var tables = {
      Doctor: `DROP TABLE IF EXISTS Doctor`,

      Patient: `DROP TABLE IF EXISTS Patient`,

      Has: `DROP TABLE IF EXISTS Has`,

      Prescription: `DROP TABLE IF EXISTS Prescription`,

      Diagnosis: `DROP TABLE IF EXISTS Diagnosis`,

      Appointment: 'DROP TABLE IF EXISTS Appointment'
    }

    return(tables);
  }
}