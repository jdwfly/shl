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
    db.close();
  }
  //dumps all the items in the prospect table into an array of objects for testing
  shl.db.listAllProspects = function() {
    var prospectList = [];
    var db = Ti.Database.open('Outreach');
    var result = db.execute('SELECT * FROM prospects ORDER BY last ASC');
    while(result.isValidRow()){
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
})();