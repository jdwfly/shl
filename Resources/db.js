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
  db.execute('DELETE FROM prospects'); //TODO Remove Before Flight
  db.close();

  //adds a new prospect to the database
  //_item : an object with ALL the attributes listed, else it will break
  shl.db.insertProspect = function(_item) {
    var db = Ti.Database.open('Outreach');
    db.execute('INSERT INTO prospects(last,firstMale, firstFemale, street, city, state, zip, country, phoneHome, '+
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
    var lastId = db.lastInsertRowId;
    db.close();
    return lastId;
  }

  //dumps all the items in the prospect table into an array of objects for testing
  shl.db.listAllProspects = function() {
    var prospectList = [];
    var db = Ti.Database.open('Outreach');
    var result = db.execute('SELECT * FROM prospects ORDER BY last ASC');
    while(result.isValidRow()) {
      prospectList.push({
        id: result.fieldByName('id'),
        last: result.fieldByName('last'),
        firstMale: result.fieldByName('firstMale'),
        firstFemale: result.fieldByName('firstFemale'),
        street: result.fieldByName('street'),
        city: result.fieldByName('city'),
        state: result.fieldByName('state'),
        zip: result.fieldByName('zip'),
        country: result.fieldByName('country'),
        phoneHome: result.fieldByName('phoneHome'),
        phoneMoble: result.fieldByName('phoneMoble'),
        email: result.fieldByName('email'),
        firstContactDate: result.fieldByName('firstContactDate'),
        firstContactPoint: result.fieldByName('firstContactPoint'),
        previouslySaved: result.fieldByName('previouslySaved'),
        previouslyBaptized: result.fieldByName('previouslyBaptized'),
        sundaySchool: result.fieldByName('sundaySchool'),
        status: result.fieldByName('status'),
        nextStep: result.fieldByName('nextStep'),
        lastContact: result.fieldByName('lastContact'),
        created: result.fieldByName('created'),
        modified: result.fieldByName('modified'),
        uuid: result.fieldByName('uuid')
      });
      result.next();
    }
    result.close();
    db.close();
    return prospectList;
  }

  shl.db.getProspect = function(prospectId) {
    var db = Ti.Database.open('Outreach');
    var result = db.execute('SELECT * FROM prospects WHERE id = ?', prospectId);
    var prospect = {
      id: result.fieldByName('id'),
      last: result.fieldByName('last'),
      firstMale: result.fieldByName('firstMale'),
      firstFemale: result.fieldByName('firstFemale'),
      street: result.fieldByName('street'),
      city: result.fieldByName('city'),
      state: result.fieldByName('state'),
      zip: result.fieldByName('zip'),
      country: result.fieldByName('country'),
      phoneHome: result.fieldByName('phoneHome'),
      phoneMoble: result.fieldByName('phoneMoble'),
      email: result.fieldByName('email'),
      firstContactDate: result.fieldByName('firstContactDate'),
      firstContactPoint: result.fieldByName('firstContactPoint'),
      previouslySaved: result.fieldByName('previouslySaved'),
      previouslyBaptized: result.fieldByName('previouslyBaptized'),
      sundaySchool: result.fieldByName('sundaySchool'),
      status: result.fieldByName('status'),
      nextStep: result.fieldByName('nextStep'),
      lastContact: result.fieldByName('lastContact'),
      created: result.fieldByName('created'),
      modified: result.fieldByName('modified'),
      uuid: result.fieldByName('uuid')
    };
    result.close();
    db.close();
    return prospect;
  }

  //ceates a prospect object from an item in a result set - must contain all the fields in the prospects table
  shl.db.loadProspectFromResult = function(result) {
    return {
      id: result.fieldByName('id'),
      last: result.fieldByName('last'),
      firstMale: result.fieldByName('firstMale'),
      firstFemale: result.fieldByName('firstFemale'),
      street: result.fieldByName('street'),
      city: result.fieldByName('city'),
      state: result.fieldByName('state'),
      zip: result.fieldByName('zip'),
      country: result.fieldByName('country'),
      phoneHome: result.fieldByName('phoneHome'),
      phoneMoble: result.fieldByName('phoneMoble'),
      email: result.fieldByName('email'),
      firstContactDate: result.fieldByName('firstContactDate'),
      firstContactPoint: result.fieldByName('firstContactPoint'),
      previouslySaved: result.fieldByName('previouslySaved'),
      previouslyBaptized: result.fieldByName('previouslyBaptized'),
      sundaySchool: result.fieldByName('sundaySchool'),
      status: result.fieldByName('status'),
      nextStep: result.fieldByName('nextStep'),
      lastContact: result.fieldByName('lastContact'),
      created: result.fieldByName('created'),
      modified: result.fieldByName('modified'),
      uuid: result.fieldByName('uuid')
    };
  } 
  
  //testing db functions
  if(Ti.Platform.osname == "android") {

    lastId = shl.db.insertProspect({
      last: "Smith",
      firstMale: "John",
      firstFemale: "Jill",
      street: "1234 Asdf St.",
      city: "Lancaster",
      state: "CA",
      zip: "93535",
      country: "United States",
      phoneHome: "(360)456-6436",
      phoneMoble: "661.158.4882",
      email: "test@example.com",
      firstContactDate: 1305998777,
      firstContactPoint: "Door knocking",
      previouslySaved: 0,
      previouslyBaptized: 0,
      sundaySchool: 0,
      status: "Active Prospect",
      nextStep: "Salvation",
      lastContact: "1306171747",
      created: "1306171747",
      modified: "1306171747",
      uuid: "a145d9a5-dbef-4e09-b112-1b8209c57aba"
    });
    var lastprospect = shl.db.getProspect(lastId);
    Ti.API.info(lastprospect.toSource());

    var testResult = shl.db.listAllProspects();
    for(i=0; i<testResult.length; i++) {
      Ti.API.info(testResult[i].toSource());
    }
  }
})();