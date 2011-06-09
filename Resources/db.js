(function() {
  //ActiveRecord.logging = true;
  //ActiveSupport.log = Ti.API.debug;

  /* Set the Adapter to Titanium and connect to the default 'app.sqlite' database */
  ActiveRecord.connect(ActiveRecord.Adapters.Titanium, "Outreach");

  ActiveRecord.execute('DROP TABLE IF EXISTS prospects');
  ActiveRecord.execute('DROP TABLE IF EXISTS contacts');
  ActiveRecord.execute('DROP TABLE IF EXISTS lists');
  ActiveRecord.execute('DROP TABLE IF EXISTS listitems');

  //******************** Prospect *****************************

  shl.Prospect = ActiveRecord.create('prospects', {
    last : '',
    firstMale : '',
    firstFemale : '',
    street : '',
    city : '',
    state : '',
    zip : '',
    country : '',
    phoneHome : '',
    phoneMoble : '',
    email : '',
    firstContactDate : 0,
    firstContactPoint : '',
    previouslySaved : 0,
    previouslyBaptized : 0,
    sundaySchool : 0,
    status : 'Active Prospect',
    starred : 0,
    nextStep : '',
    lastContact : 0,
    createdDate : 0,
    modified : 0,
    uuid : ''
  });
  shl.Prospect.hasMany('contacts', {
    dependent: true
  });

  shl.Prospect.beforeCreate( function(prospect) {
    prospect.set('uuid',Ti.Platform.createUUID());
    var currentTime = Math.round(new Date().getTime()/1000.0);
    prospect.set('createdDate',currentTime);
    prospect.set('modified',currentTime);
    prospect.set('lastContact',currentTime);
    if (prospect.firstContactDate == 0) {
      prospect.set('firstContactDate',currentTime);
    }
    if (prospect.previouslySaved == 0) {
      prospect.set('nextStep','Salvation');
    } else {
      prospect.set('nextStep','Attendance');
    }

  });

  //************************* Contacts **************************************
  shl.Contact = ActiveRecord.create('contacts', {
    type : '',
    prospect_id : 0,
    date : 0,
    comments : '',
    indevidual : '',
    createdDate : 0,
    modified : 0,
    uuid : ''
  });
  shl.Contact.belongsTo('prospect');

  shl.Contact.beforeCreate( function(contact) {
    contact.set('uuid',Ti.Platform.createUUID());
    var currentTime = Math.round(new Date().getTime()/1000.0);
    contact.set('createdDate',currentTime);
    contact.set('modified',currentTime);
    if (contact.date == 0) {
      contact.set('date',currentTime);
    }
  });

  //************************* Lists *****************************************

  shl.List = ActiveRecord.create('lists', {
    name : '',
    weight : 0,
    active : 0,
    createdDate : 0,
    modified : 0,
    uuid : ''
  });
  shl.List.hasMany('ListItem');
  shl.List.hasMany('Prospect', {
    through: 'ListItem'
  });

  shl.List.beforeCreate( function(list) {
    list.set('uuid',Ti.Platform.createUUID());
    var currentTime = Math.round(new Date().getTime()/1000.0);
    list.set('createdDate',currentTime);
    list.set('modified',currentTime);
  });

  //************************* List Items **************************************

  shl.ListItem = ActiveRecord.create('listitems', {
    prospect_id : 0,
    list_id : 0,
    createdDate : 0,
    uuid : ''
  });

  shl.ListItem.belongsTo('Prospect', {
    dependent: true
  });
  shl.ListItem.belongsTo('List', {
    dependent: true
  });

  shl.List.beforeCreate( function(listitem) {
    listitem.set('uuid',Ti.Platform.createUUID());
    var currentTime = Math.round(new Date().getTime()/1000.0);
    listitem.set('createdDate',currentTime);
    listitem.set('modified',currentTime);
  });

  //************************* Tests ******************************************
  var testProspect = shl.Prospect.create({
    last: "Jones",
    firstMale: "John",
    email : "test@example.com"
  });
  Ti.API.info("***************" + testProspect.toJSON());
  testProspect.save();
  var testContact = testProspect.createContact({
    type : "visit",
    comments : 'Not home'
  });
  Ti.API.info(testContact.toJSON());
  Ti.API.info("***cont*****" + testProspect.getContactCount());
  var foundProspect = shl.Prospect.find(testProspect.id);
  Ti.API.info(foundProspect.toJSON());
  var list = foundProspect.getContactList();
  Ti.API.info(list[0].toJSON());

})();