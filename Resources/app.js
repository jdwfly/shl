Ti.UI.setBackgroundColor('#ffffff');

var shl = {};
Ti.include('ui.js', 'db.js');

var tabs = shl.ui.createApplicationTabGroup();
tabs.open();

Ti.API.info('Welcome to Outreach for '+Ti.Platform.osname);

//testing db functions
shl.db.insertProspect({
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

var testResult = shl.db.listAllProspects();
for(i=0; i<testResult.length; i++) {
  Ti.API.info(testResult[i].toSource());
}
