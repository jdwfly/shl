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
    'All Active Prospects' : {
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
          status : 'Dead End'
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
    'No Contact: 7 Days' : {
      weight : '4',
      active : 1,
      query : {
        where : "status = 'Active Prospect' AND lastContact < (strftime('%s', 'now') - 604800)",
        order : 'last DESC'
      }
    },
    'No Contact: 14 Days' : {
      weight : '1',
      active : 0,
      query : {
        where : "status = 'Active Prospect' AND lastContact < (strftime('%s', 'now') - 1209600)",
        order : 'last DESC'
      }
    },
    'No Contact: 30 Days' : {
      weight : '1',
      active : 0,
      query : {
        where : "status = 'Active Prospect' AND lastContact < (strftime('%s', 'now') - 2592000)",
        order : 'last DESC'
      }
    }
  }

  /* Set the Adapter to Titanium and connect to the default 'app.sqlite' database */
  ActiveRecord.connect(ActiveRecord.Adapters.Ti, "Outreach");
  if (shl.debugMode){
    ActiveRecord.execute('DROP TABLE IF EXISTS prospects');
    ActiveRecord.execute('DROP TABLE IF EXISTS contacts');
    ActiveRecord.execute('DROP TABLE IF EXISTS lists');
    ActiveRecord.execute('DROP TABLE IF EXISTS listitems');
    ActiveRecord.execute('DROP TABLE IF EXISTS listings');
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
    phoneMobile : '',
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
  }, {
    formatName : function() {
      var title;
      if (this.firstMale !== '') {
        title = this.firstMale;
        if (this.firstFemale !== '') {
          title += ' and ' + this.firstFemale;
        }
        if (this.last !== '') {
          title += ' ' + this.last;
        }
      } else if (this.firstFemale !== '') {
        title = this.firstFemale;
        if (this.last !== '') {
          title += ' ' + this.last;
        }
      }
      return title;
    },
    formatContactPretty : function() {
      var date, day_diff, diff;
      date = new Date(this.lastContact * 1000);
      diff = ((new Date()).getTime() - date.getTime()) / 1000;
      day_diff = Math.floor(diff / 86400);
      if (isNaN(day_diff) || day_diff < 0) {
        return '';
      }
      return day_diff == 0 && (diff < 60 && "just now" || diff < 120 && "1 minute ago" || diff < 3600 && Math.floor(diff / 60) + " minutes ago" || diff < 7200 && "1 hour ago" || diff < 86400 && Math.floor(diff / 3600) + " hours ago") || day_diff == 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || day_diff > 6 && Math.ceil(day_diff / 7) + " weeks ago";
    },
    formatAddress : function() {
      return '' + ((this.street != null) && this.street !== '' ? this.street : '') + ((this.city != null) && this.city !== '' ? "\n" + this.city : '') + ((this.state != null) && this.state !== '' ? ", " + this.state : '') + ((this.zip != null) && this.zip !== '' ? " " + this.zip : '');
    },
    formatAddressGoogle : function() {
      return '' + ((this.street != null) && this.street !== '' ? this.street : '') + ((this.city != null) && this.city !== '' ? " " + this.city : '') + ((this.state != null) && this.state !== '' ? ", " + this.state : '') + ((this.zip != null) && this.zip !== '' ? " " + this.zip : '');
    },
    isStarred : function() {
      result = this.getListingList({
        where: {
          list_id: 1
        }
      });
      return result[0] == null ? false : true;
    }
  });
  shl.Prospect.hasMany('contacts', {
    dependent: true
  });
  shl.Prospect.hasMany('Listing');
  shl.Prospect.hasMany('List', {
    through: 'Listing'
  });

  shl.Prospect.beforeCreate( function(prospect) {
    prospect.set('uuid',Ti.Platform.createUUID());
    var currentTime = Math.round(new Date().getTime()/1000.0);
    prospect.set('createdDate',currentTime);
    prospect.set('modified',currentTime);
    if (prospect.firstContactDate =! 0) {
      prospect.set('lastContact', prospect.get('firstContactDate'));
    } else {
      prospect.set('lastContact', currentTime);
    }
    if (prospect.firstContactDate == 0) {
      prospect.set('firstContactDate',currentTime);
    }
    if (prospect.previouslySaved == 0) {
      prospect.set('nextStep','Salvation');
    } else {
      prospect.set('nextStep','Baptism');
    }

  });

  shl.Prospect.beforeDestroy(function(prospect) {
    var z = shl.Listing.find({
      where : {
        prospect_id : prospect.id
      }
    });
    for (var listing in z){
      if (z[listing].id != null) {
        fulllisting = shl.Listing.find(z[listing].id);
        fulllisting.destroy();
      }
    }
    var y = shl.Contact.find({
      where : {
        prospect_id : prospect.id
      }
    });
    for (var contact in y){
      if (y[contact].id != null) {
        fullcontact = shl.Contact.find(y[contact].id);
        fullcontact.destroy();
      }
    }
  });


  
  
  
  shl.Prospect.observe('beforeUpdate', function(prospect){
    var currentTime = Math.round(new Date().getTime()/1000.0);
    prospect.set('modified',currentTime);
    //Set next step
    if (prospect.previouslySaved == 0 && shl.Contact.count({
      where : {
        type : 'Saved',
        prospect_id : prospect.id
      }
    }) < 1){
      prospect.set('nextStep','Salvation');
    }
    else {
      if(prospect.previouslyBaptized == 0 && shl.Contact.count({
        where : {
          type : 'Baptized',
          prospect_id : prospect.id
        }
      }) < 1){
        prospect.set('nextStep','Baptism');
      }
      else {
        if(!prospect.attended){
          prospect.set('nextStep','Attendance');
        }
        else {
          prospect.set('nextStep','Membership');
        }
      }
    }
    
    //date of last contact
    //don't think we need this as this should be updated every time we record a prospect - the only problem will be when we add sync
    /*prospect.set('lastContact',shl.Contact.max('date', {
      where : ["prospect_id = ? AND type <> 'Comment'", prospect.id]
    }));*/
    
  });
  
  shl.Prospect.search = function (q){
    var z = q + 'z';
    return shl.Prospect.find({
      where : ['(last COLLATE NOCASE BETWEEN ? AND ?) OR (firstFemale COLLATE NOCASE BETWEEN ? AND ?) OR (firstMale COLLATE NOCASE BETWEEN ? AND ?) OR (street COLLATE NOCASE BETWEEN ? AND ?)', q, z, q, z, q, z, q, z],
      order : 'id DESC'
    });
  };

  //************************* Contacts **************************************
  shl.Contact = ActiveRecord.create('contacts', {
    type : '',
    prospect_id : 0,
    date : 0,
    comments : '',
    individual : '',
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
  shl.List.hasMany('Listing');
  shl.List.hasMany('Prospect', {
    through: 'Listing'
  });

  shl.List.beforeCreate( function(list) {
    list.set('uuid',Ti.Platform.createUUID());
    var currentTime = Math.round(new Date().getTime()/1000.0);
    list.set('createdDate',currentTime);
    list.set('modified',currentTime);
  });

  //************************* Listings **************************************

  shl.Listing = ActiveRecord.create('listings', {
    prospect_id : 0,
    list_id : 0,
    createdDate : 0,
    uuid : ''
  });

  shl.Listing.belongsTo('Prospect', {
    dependent: true
  });
  shl.Listing.belongsTo('List', {
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
    shl.List.create({
      name: 'Starred',
      active: 0,
      weight: 40,
      id: 1
    });
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
  
  // Check and remove orphaned starred prospects records
  function removeListingOrphans() {
    var starListing, prospect;
    starListing = shl.Listing.find({
      all: true,
      order: 'id DESC'
    });
    if (starListing.length > 0) {
      for (id in starListing) {
        Ti.API.info('Listing = ' + JSON.stringify(starListing[id]));
        if (starListing[id].id != null) {
          prospect = shl.Prospect.find(starListing[id].prospect_id);
          if (prospect == false) {
            starListing[id].destroy();
          }
        }
      }
    }
  }
  removeListingOrphans();
  
  //************************* Tests ******************************************
  /*
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
      zip: '93535',
      country: 'United States',
      phoneHome: '661-946-4663',
      phoneMobile: '661-946-4668',
      email: 'fake@email.com',
      firstContactPoint: 'soulwinning'
    });
    var testProspect3 = shl.Prospect.create({
      last: 'Brown',
      firstFemale: 'Jackie',
      street: '3456 Easy St.',
      city: 'Palmdale',
      state: 'CA'
    });
    var testList = shl.List.create({
      name: 'TEST',
      active: 1
    });
    testList.createListing({
      prospect_id : 1
    });
    testList.createListing({
      prospect_id : 2
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
  */
})();