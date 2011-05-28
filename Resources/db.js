(function() {
  shl.db = {};

  //function to create table based on an object
  shl.db.createTable = function (table) {
    //bootstrap database
    var db = Ti.Database.open('Outreach');
    var qstring = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (';
    var firstField = true;
    for (var field in table.fields) {
      if (table.fields.hasOwnProperty(field)) {
        if (!firstField) {
          qstring += ', ';
        }
        qstring += (field + ' ' + table.fields[field]);
        firstField = false;
      }
    }
    qstring += ')'
    db.execute('DROP TABLE IF EXISTS ' + table.name); //TODO Remove Before Flight
    db.execute(qstring);
    db.close();
    return table;
  }

  //create the prospects table; save field defs for later
  shl.db.prospects = shl.db.createTable({
    name : 'prospects',
    fields : {
      id : 'INTEGER PRIMARY KEY',
      last : 'TEXT',
      firstMale : 'TEXT',
      firstFemale : 'TEXT',
      street : 'TEXT',
      city : 'TEXT',
      state : 'TEXT',
      zip : 'TEXT',
      country : 'TEXT',
      phoneHome : 'TEXT',
      phoneMoble : 'TEXT',
      email : 'TEXT',
      firstContactDate : 'INTEGER',
      firstContactPoint : 'TEXT',
      previouslySaved : 'INTEGER',
      previouslyBaptized : 'INTEGER',
      sundaySchool : 'INTEGER',
      status : 'TEXT',
      nextStep : 'TEXT',
      lastContact : 'INTEGER',
      created : 'INTEGER',
      modified : 'INTEGER',
      uuid : 'TEXT'
    }
  });

  //base class
  shl.db.Model = function() {
    Ti.API.info('just made an object of type Model');
    Ti.API.info(this.toSource());
  }

  shl.db.Model.prototype.save = function() {
    Ti.API.info('just called save method for Model');
    Ti.API.info(this.toSource());
  }

  shl.db.Model.prototype.find = function() {
    Ti.API.info('just called find method for Model');
    Ti.API.info(this.toSource());
  }
  
  
  //we can define defalts here
  shl.db.Model.prototype.state = 'CA';
  

  shl.Prospect = function() {
    shl.db.Model.call(this);
    Ti.API.info('just made an object of type Prospect');
    Ti.API.info(this.toSource());
  }

  shl.Prospect.prototype = new shl.db.Model();
  shl.Prospect.prototype.constructor = shl.Prospect;
  
  //we can define static defaults here - these will get saved to the database if no other is specified
  shl.db.Model.prototype.previouslySaved = 0;
  shl.db.Model.prototype.previouslyBaptized = 0;
  shl.db.Model.prototype.sundaySchool = 0;
  shl.db.Model.prototype.status = 'Active Prospect';
  shl.db.Model.prototype.nextStep = 'Salvation';
  
  

  //adds a new prospect to the database
  //_item : an object with ALL the attributes listed, else it will break
  shl.db.insertProspect = function(_item) {
    var db = Ti.Database.open('Outreach');
    var currentTimeStamp = Math.round(new Date().getTime()/1000.0);
    db.execute('INSERT INTO prospects(last,firstMale, firstFemale, street, city, state, zip, country, phoneHome, '+
    'phoneMoble, email, firstContactDate, firstContactPoint, previouslySaved, previouslyBaptized, sundaySchool, status, nextStep, lastContact, created, modified, uuid) '+
    'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    ('last' in _item) ? _item.last : "",
    ('firstMale' in _item) ? _item.firstMale : "",
    ('firstFemale' in _item) ? _item.firstFemale : "",
    ('street' in _item) ? _item.street : "",
    ('city' in _item) ? _item.city : "",
    ('state' in _item) ? _item.state : "",
    ('zip' in _item) ? _item.zip : "",
    ('country' in _item) ? _item.country : "",
    ('phoneHome' in _item) ? _item.phoneHome : "",
    ('phoneMoble' in _item) ? _item.phoneMoble : "",
    ('email' in _item) ? _item.email : "",
    ('firstContactDate' in _item) ? _item.firstContactDate : currentTimeStamp,
    ('firstContactPoint' in _item) ? _item.firstContactPoint : "",
    ('previouslySaved' in _item) ? _item.previouslySaved : 0,
    ('previouslyBaptized' in _item) ? _item.previouslyBaptized : 0,
    ('sundaySchool' in _item) ? _item.sundaySchool : 0,
    ('status' in _item) ? _item.status : "Active Prospect",
    ('nextStep' in _item) ? _item.nextStep : "Salvation",
    ('lastContact' in _item) ? _item.lastContact : currentTimeStamp,
    ('created' in _item) ? _item.created : currentTimeStamp,
    ('modified' in _item) ? _item.modified : currentTimeStamp,
    ('uuid' in _item) ? _item.uuid : Ti.Platform.createUUID()
    );
    //TODO check to see if uuid, timestamp are empty
    var lastId = db.lastInsertRowId;
    db.close();
    return lastId;
  }

  //low level update function
  //TODO we need a higher level function that updates status flags and the like
  //will crash if there is not a valid id
  //all other properties must be valid columbs of the prospects table
  //_item an object that contains only data to be updated and an id
  shl.db.updateProspect = function(_item) {

    var first = true;
    var subList = [];
    var set = '';
    var rows = 0;

    for (var property in _item) {
      //TODO check against a list of valid properties
      if (_item[property] != undefined && property != 'id') {
        set += (first == false ? ', ' : '') + property + ' = ?';
        subList.push(_item[property]);
        first = false;
      }
    }
    subList.push(_item.id);
    if (set != '') {
      var db = Ti.Database.open('Outreach');
      db.execute('UPDATE prospects SET ' + set + ' WHERE id = ?', subList);
      rows = db.rowsAffected;
      db.close();
    }
    return rows;
  }

  //dumps all the items in the prospect table into an array of objects for testing
  //TODO pass this funciton a WHERE statement
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

  shl.db.deleteProspect = function(_id) {
    var db = Ti.Database.open('Outreach');
    db.execute("DELETE FROM prospects WHERE id = ?", _id);
    db.close();
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

  //testing stuff
  //TODO remove all this testing code and its evil global vars

  var testProspect = new shl.Prospect();
  testProspect.save();
  testProspect.find();
  Ti.API.info(testProspect.nextStep);

  var lastId = shl.db.insertProspect({
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

  shl.db.updateProspect({
    id: lastId,
    street: "new street",
    last: "Bass"
  });

  var lastprospect = shl.db.getProspect(lastId);
  Ti.API.info(lastprospect.toSource());

  shl.db.insertProspect({
    last: "Jones",
    firstMale: "John",
    firstFemale: "Jill",
    street: "1234 Asdf St."
  });

  shl.db.insertProspect({
    firstMale: "John",
    firstFemale: "Jill",
    street: "1234 Asdf St.",
    nextStep: "Salvation"
  });

  var testResult = shl.db.listAllProspects();
  for(i=0; i<testResult.length; i++) {
    Ti.API.info(testResult[i].toSource());
  }
})();