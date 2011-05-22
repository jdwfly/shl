(function() {
	shl.db = {};
	
	//bootstrap database
	var db = Ti.Database.open('OutreahDatabase');
	db.execute('CREATE TABLE IF NOT EXISTS prospects(id INTEGER PRIMARY KEY, last TEXT, firstMale TEXT, firstFemale TEXT, street TEXT, city TEXT, state TEXT, zip TEXT, country TEXT, phoneHome TEXT, phoneMoble TEXT, email TEXT, firstContactDate INTEGER, firstContactPoint TEXT, previouslySaved INTEGER, previouslyBaptized INTEGER, sundaySchool INTEGER, status TEXT, nextStep TEXT, lastContact INTEGER, created INTEGER, modified INTEGER, uuid TEXT);');
	db.close();

  



})();