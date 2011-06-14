(function() {
  //ActiveRecord.logging = true;
  //ActiveSupport.log = Ti.API.debug;

  //Built in auto lists
  shl.aLists = {
    'All' : {
      weight : 10,
      active : 0,
      query : {
        order : 'last DESC'
      }
    },
    'Active Prospects' : {
      weight : '1',
      active : 1,
      query : {
        where : {
          status : 'Active Prospect'
        },
        order : 'last DESC'
      }
    },
    'Visitor Follow up' : {
      weight : '2',
      active : 1,
      query : {
        where : {
          status : 'Active Prospect',
          attended : 1
        },
        order : 'last DESC'
      }
    },
    'Church Prospects' : {
      weight : '3',
      active : 1,
      query : {
        where : {
          status : 'Active Prospect',
          attended : 0
        },
        order : 'last DESC'
      }
    },
    'Salvation Prospects' : {
      weight : '1',
      active : 0,
      query : {
        where : {
          status : 'Active Prospect',
          nextStep : 'Salvation'
        },
        order : 'last DESC'
      }
    },
    'Baptism Prospects' : {
      weight : '1',
      active : 0,
      query : {
        where : {
          status : 'Active Prospect',
          nextStep : 'Baptism'
        },
        order : 'last DESC'
      }
    },
    'Membership Prospects' : {
      weight : '1',
      active : 0,
      query : {
        where : {
          status : 'Active Prospect',
          nextStep : 'Membership'
        },
        order : 'last DESC'
      }
    },
    'Members' : {
      weight : '1',
      active : 0,
      query : {
        where : {
          status : 'Member'
        },
        order : 'last DESC'
      }
    },
    'Dead Ends' : {
      weight : '1',
      active : 0,
      query : {
        where : {
          status : 'Dead end'
        },
        order : 'last DESC'
      }
    },
    'Inactive' : {
      weight : '5',
      active : 1,
      query : {
        where : {
          status : 'Inactive Prospect'
        },
        order : 'last DESC'
      }
    },
    'Sunday School Prospects' : {
      weight : '1',
      active : 0,
      query : {
        where : {
          status : 'Active Prospect',
          sundaySchool : 0
        },
        order : 'last DESC'
      }
    },
    'No Contact: This Week' : {
      weight : '4',
      active : 1,
      query : {
        where : {
          status : 'Active Prospect'
        },
        order : 'last DESC'
      }
    },
    'No Contact: 14 Days' : {
      weight : '1',
      active : 0,
      query : {
        where : {
          status : 'Active Prospect'
        },
        order : 'last DESC'
      }
    },
    'No Contact: 30 Days' : {
      weight : '1',
      active : 0,
      query : {
        where : {
          status : 'Active Prospect'
        },
        order : 'last DESC'
      }
    }
  }

  /* Set the Adapter to Titanium and connect to the default 'app.sqlite' database */
  ActiveRecord.connect(ActiveRecord.Adapters.Titanium, "Outreach");
  if (shl.debugMode){
    ActiveRecord.execute('DROP TABLE IF EXISTS prospects');
    ActiveRecord.execute('DROP TABLE IF EXISTS contacts');
    ActiveRecord.execute('DROP TABLE IF EXISTS lists');
    ActiveRecord.execute('DROP TABLE IF EXISTS listitems');
    Ti.App.Properties.removeProperty('dbInitComplete');
  }
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
    attended : 0,
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
      prospect.set('nextStep','Baptism');
    }

  });
  
  
  
  shl.Prospect.observe('beforeUpdate', function(prospect){
    var currentTime = Math.round(new Date().getTime()/1000.0);
    prospect.set('modified',currentTime);
    //Set next step
    if (!prospect.previouslySaved && ActiveRecord.Contact.count({
      where : {
        type : 'Saved',
        prospect_id : propect.id
      }
    }) < 1){
      prospect.set('nextStep','Salvation');
    }
    else if(!prospect.previouslyBaptized && ActiveRecord.Contact.count({
      where : {
        type : 'Baptized',
        prospect_id : propect.id
      }
    }) < 1){
      prospect.set('nextStep','Baptism');
    }
    else if(!prospect.attended){
      prospect.set('nextStep','Attendance');
    }
    else {
      prospect.set('nextStep','Membership');
    }
    
    //date of last contact
    //don't think we need this as this should be updated every time we record a prospect - the only problem will be when we add sync
    /*prospect.set('lastContact',shl.Contact.max('date', {
      where : ["prospect_id = ? AND type <> 'Comment'", prospect.id]
    }));*/
    
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
  
  shl.Contact.afterSave( function(contact) {
    var prospect = shl.Prospect.find(contact.prospect_id);
    if (prospect !== false){
      if (contact.type === 'Joined the church'){
        prospect.set("status", "Member");
      }
      if (contact.type === 'Visited Church'){
        prospect.set("attended", 1);
      }
      if (contact.type !== 'Comment'){
        prospect.set('lastContact', contact.date);
      }
      prospect.save();
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

//*************** Init *************************
  
  shl.dbInit = function() {
    for (list in shl.aLists) {
      if (shl.aLists.hasOwnProperty(list)) {
        shl.List.create({
          name : list,
          weight : shl.aLists[list].weight,
          active : shl.aLists[list].active
        });
      }
    }
  };
  
  if (!Ti.App.Properties.hasProperty('dbInitComplete')) {
    shl.dbInit();
    Ti.App.Properties.setBool('dbInitComplete', true);
  }
  
  //************************* Tests ******************************************
  var testProspect = shl.Prospect.create({
    last: "Jones",
    firstMale: "John",
    email : "test@example.com"
  });
  var testProspect2 = shl.Prospect.create({
    last: 'Smith',
    firstMale: 'Jack',
    firstFemale: 'Shirley',
    street: '4321 Main St.',
    city: 'Lancaster',
    state: 'CA',
    zip: '93535'
  });
  var testProspect3 = shl.Prospect.create({
    last: 'Brown',
    firstFemale: 'Jackie',
    street: '3456 Easy St.',
    city: 'Palmdale',
    state: 'CA'
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