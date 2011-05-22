(function() {
  shl.db = {};

  //bootstrap database
  var db = Ti.Database.open('Outreach');
  //No, there isn't a better way to do multi-line strings in js, and Eclipse does not support word-wrap without a plug-in. Yes, concatenation in inefficient.
  db.execute('CREATE TABLE IF NOT EXISTS prospects('+
  'id INTEGER PRIMARY KEY, last TEXT, firstMale TEXT, firstFemale TEXT, street TEXT, '+
  'city TEXT, state TEXT, zip TEXT, country TEXT, phoneHome TEXT, phoneMoble TEXT, email TEXT, '+
  'firstContactDate INTEGER, firstContactPoint TEXT, previouslySaved INTEGER, previouslyBaptized INTEGER, '+
  'sundaySchool INTEGER, status TEXT, nextStep TEXT, lastContact INTEGER, created INTEGER, modified INTEGER, uuid TEXT);');
  db.close();

  //adds a new prospect to the database
  //_item : an object with ALL the attributes listed, else it will break
  shl.db.insertProspect = function(_item) {
    var db = Ti.Database.open('Outreach');
    db.execute('INSERT INTO fugitives(last,firstMale, firstFemale, street, city, state, zip, country, phoneHome, '+
    'phoneMoble, email, firstContactDate, firstContactPoint, previouslySaved, previouslyBaptized, sundaySchool, status, nextStep, lastContact, created, modified, uuid) '+
    'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    _item.last,
    _item.firstMale,
    _item.firstFemale,
    _item.street,
    _item.city,
    _item.state,
    _item.zip,
    _item.country,
    _item.phoneHome,
    _item.phoneMoble,
    _item.email,
    _item.firstContactDate,
    _item.firstContactPoint,
    _item.previouslySaved,
    _item.previouslyBaptized,
    _item.sundaySchool,
    _item.status,
    _item.nextStep,
    _item.lastContact,
    _item.created,
    _item.modified,
    _item.uuid
    );
    db.close();
  }
  //dumps all the items in the prospect table into an array of objects for testing
  shl.db.listAllProspects = function() {
    var prospectList = [];
    var db = Ti.Database.open('Outreach');
    //TODO something here

    db.close();
    return prospectList;
  }
})();