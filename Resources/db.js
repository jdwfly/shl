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

  //********************************************** Base DB Model ************************************************
  // note: all db tables are assumed to have an id property
  shl.db.Model = function(initVal) {
    if (initVal) {
      for (field in initVal) {
        if (initVal.hasOwnProperty(field)) {
          this[field] = initVal[field];
        }
      }
    }
  }

  shl.db.Model.prototype.save = function() {
    //if it already exists, update
    //only updates fields that are defined in the object, does not inherit or set default fields unless they are set by .preUpdate()
    var first = true;
    var subList = [];
    var fieldCount = '';
    var set = '';
    var rows = 0;
    //if it already exists, update
    if (this.id && typeof this.id === 'number' && this.id > 0) {
      this.preUpdate();
      for (var field in this.structure.fields) {
        if (this.hasOwnProperty(field) && field !== 'id') {
          set += (first == false ? ', ' : '') + field + ' = ?';
          subList.push(this[field]);
          first = false;
        }
      }
      subList.push(this.id);
      if (set !== '') {
        var db = Ti.Database.open('Outreach');
        db.execute('UPDATE ' + this.structure.name + ' SET ' + set + ' WHERE id = ?', subList);
        rows = db.rowsAffected;
        db.close();
      }
      return rows;
    }
    //if it does not exist, insert
    //on istert we will substitute default values if one is not set
    else {
      this.preInsert();
      for (var field in this.structure.fields) {
        if (field !== 'id') {
          set += (first == false ? ',' : '') + field;
          fieldCount += (first == false ? ',?' : '?');
          subList.push(this[field] || '');
          first = false;
        }
      }
      if (set !== '') {
        var db = Ti.Database.open('Outreach');
        db.execute('INSERT INTO ' + this.structure.name + ' (' + set + ') VALUES(' +  fieldCount + ')', subList);
        rows = db.rowsAffected;
        this.id = db.lastInsertRowId;
        db.close();
      }
      return rows;
    }
  }

  shl.db.Model.prototype.destroy = function() {
    this.preDestroy();
    var db = Ti.Database.open('Outreach');
    db.execute("DELETE FROM " + this.structure.name + " WHERE id = ?", this.id);
    db.close();
  }

  shl.db.Model.prototype.preUpdate = function() {
    //do stuff before we update the record
  }

  shl.db.Model.prototype.preInsert = function() {
    //do stuff before we insert a new record
  }

  shl.db.Model.prototype.preDestroy = function() {
    //do stuff before we delete a record
  }

  //********************************************** THE find method ************************************************
  shl.db.Model.find = function(params, subValues) {
    var loadObject = function (that, resultSet) {
      var newObj = new that(); // yep, it works :-)
      for (field in newObj.structure.fields) {
        if (typeof field !== 'function') {
          newObj[field] = resultSet.fieldByName(field);
        }
      }
      return newObj;
    }

    if (typeof params  === "undefined") {
      params = "ORDER BY id ASC";
    }
    if (typeof params === "number") {
      var db = Ti.Database.open('Outreach');
      var result = db.execute('SELECT * FROM ' + this.prototype.structure.name + ' WHERE id = ?', params);
      if (!result.rowCount === 0) {
        return false;
      }
      var foundObj = loadObject(this, result);
      result.close();
      db.close();
      return foundObj;
    }
    if (typeof params === "string") {
      var db = Ti.Database.open('Outreach');
      var qstring = 'SELECT * FROM ' + this.prototype.structure.name + ' ' + params;
      if (subValues){
        var result = db.execute(qstring, subValues);
      }
      else {
        var result = db.execute(qstring);
      }
      
      if (!result.rowCount === 0) {
        return false;
      }
      var itemList = [];
      while(result.isValidRow()) {
        itemList.push(loadObject(this, result));
        result.next();
      }
      result.close();
      db.close();
      return itemList;
    }

  }

  //********************************************** Prospects table ************************************************
  shl.Prospect = function(initVal) {
    shl.db.Model.call(this, initVal);
  }

  shl.Prospect.prototype = new shl.db.Model();
  shl.Prospect.prototype.constructor = shl.Prospect;
  shl.Prospect.prototype.structure = shl.db.createTable({
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
  shl.Prospect.find = shl.db.Model.find;

  //we can define static defaults here - these will get saved to the database if no other is specified
  shl.Prospect.prototype.previouslySaved = 0;
  shl.Prospect.prototype.previouslyBaptized = 0;
  shl.Prospect.prototype.sundaySchool = 0;
  shl.Prospect.prototype.status = 'Active Prospect';
  shl.Prospect.prototype.nextStep = 'Salvation';

  //adds a new prospect to the database
  shl.db.insertProspect = function(_item) {
    var newProspect = new shl.Prospect(_item);
    newProspect.save();
    return newProspect;
  }

  //dumps all the items in the prospect table into an array of objects for testing
  //TODO remove this testing funciton and all uses of it - replace with Prospect.find
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
    var toGo = shl.Prospect.find(_id);
    toGO.destroy();
    return toGo;
  }

  shl.db.getProspect = function(prospectId) {
    return shl.Prospect.find(prospectId);
  }

  // ******************************* testing stuff *****************************************
  //TODO remove all this testing code

  var testProspect = new shl.Prospect();
  testProspect.save();
  Ti.API.info(testProspect.nextStep);

  var lastIns = shl.db.insertProspect({
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

  var lastprospect = shl.db.getProspect(lastIns.id);
  Ti.API.info(JSON.stringify(lastprospect));

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

  //var testResult = shl.db.listAllProspects();
  var testResult = shl.Prospect.find();
  for(i=0; i<testResult.length; i++) {
    Ti.API.info("item:" + JSON.stringify(testResult[i]));
  }

  var foundProspect = shl.Prospect.find(1);
  Ti.API.info(JSON.stringify(foundProspect));
  foundProspect.firstMale = "TEST";
  foundProspect.save();
  var newProspect = shl.Prospect.find(1);
  Ti.API.info('final result' + JSON.stringify(newProspect));
})();