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
    status : '',
    starred : 0,
    nextStep : '',
    lastContact : 0,
    created : 0,
    modified : 0,
    uuid : ''
  });
  shl.Prospect.hasMany('contacts',{
    dependent: true
  });
  
  //************************* Contacts **************************************
  shl.Contact = ActiveRecord.create('contacts', {
     type : '',
     prospect_id : 0,
     date : 0,
     comments : '',
     indevidual : '',
     created : 0,
     modified : 0,
     uuid : ''
  });
  shl.Contact.belongsTo('prospect');
  
  //************************* Lists *****************************************
  
  shl.List = ActiveRecord.create('lists', {
     name : '',
     weight : 0,
     active : 0,
     created : 0,
     modified : 0,
     uuid : ''
   });
  shl.List.hasMany('ListItem');
  shl.List.hasMany('Prospect', {
    through: 'ListItem'
  });
  //************************* List Items **************************************

  shl.ListItem = ActiveRecord.create('listitems', {
     prospect_id : 0,
     list_id : 0,
     created : 0,
     uuid : ''
   });
   
   shl.ListItem.belongsTo('Prospect',{
     dependent: true
   });
   shl.ListItem.belongsTo('List',{
     dependent: true
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