(function() {
  shl.ui = {};
  
  // _prospects = array of prospect objects
  shl.ui.createProspectTableView = function(_prospects) {
    var data = [], title = '';
    for(i=0; i<_prospects.length; i++) {
      var row = Ti.UI.createTableViewRow({
        height: 'auto',
        hasChild: true
      });
      var content = Ti.UI.createView({
        height: 'auto',
        layout: 'vertical',
        left: 10,
        top: 10,
        bottom: 10,
        right: 10
      });
      
      // TODO this should probably be a function
      if (_prospects[i].firstMale != '') {
        title = _prospects[i].firstMale;
        if (_prospects[i].firstFemale != '') {
          title += " and " + _prospects[i].firstFemale;
        }
        if (_prospects[i].last != '') {
          title += " " + _prospects[i].last;
        }
      } else if (_prospects[i].firstFemale != '') {
        title = _prospects[i].firstFemale;
        if (_prospects[i].last != '') {
          title += " " + _prospects[i].last;
        }
      }
      contentTitle = Ti.UI.createLabel({
        text: title,
        font: {fontWeight: 'bold', fontSize:18},
        height: 'auto',
        width: 'auto',
        left: 5
      });
      // TODO Should be it's own function, only goes back one month
      var lastContactPretty = (function() {
        var date = new Date(_prospects[i].lastContact * 1000),
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400);

        if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
          return;
            
        return day_diff == 0 && (
            diff < 60 && "just now" ||
            diff < 120 && "1 minute ago" ||
            diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
            diff < 7200 && "1 hour ago" ||
            diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
            day_diff == 1 && "Yesterday" ||
            day_diff < 7 && day_diff + " days ago" ||
            day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
      })();
      lastContactLabel = Ti.UI.createLabel({
        text: 'Last Contact: ' + lastContactPretty,
        font: {fontWeight: 'normal', fontSize: 12},
        height: 'auto',
        width: 'auto',
        left: 5
      });
      // TODO this should probably be it's own function as well
      var address = '';
      if (_prospects[i].street != '') {
        address = _prospects[i].street + ((_prospects[i].city != '') ? "\n" + _prospects[i].city : '') + ((_prospects[i].state != '') ? ", " + _prospects[i].state : '');
      } else if (_prospects[i].city != '') {
        address = _prospects[i].city + ((_prospects[i].state != '') ? ", " + _prospects[i].state : '');
      } else if (_prospects[i].state != '') {
        address = _prospects[i].state;
      }
      if (_prospects[i].zip != '') {
        address += ' ' + _prospects[i].zip;
      }
      //var address = _prospects[i].street + "\n" + _prospects[i].city + ", " + _prospects[i].state + " " + _prospects[i].zip;
      var addressLabel = Ti.UI.createLabel({
        text: address,
        font: {fontWeight: 'normal', fontSize: 12},
        height: 'auto',
        width: 'auto',
        left: 5
      });
      content.add(contentTitle);
      content.add(lastContactLabel);
      content.add(addressLabel);
      row.add(content);
      data.push(row);
    }
    var tableView = Titanium.UI.createTableView({data:data});
    
    tableView.addEventListener('click', function(e) {
      alert('haha! you thought this would do something didnt you!');
    });
    
    return tableView;
  };
  
  // TODO This looks nasty in android
  shl.ui.createAddWindow = function() {
    var win = Ti.UI.createWindow({
      title: 'Add Prospect',
      backgroundColor:'#eeeeee'
    });
    
    if (Ti.Platform.osname === 'iphone') {
      var b = Titanium.UI.createButton({
        title:'Close',
        style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
      });
      b.addEventListener('click',function() {
        win.close();
      });
      win.setRightNavButton(b);
    }

    var data = [];
    var s1 = Ti.UI.createTableViewSection();
    // First Name Field
    var fnameRow = Ti.UI.createTableViewRow({
      height: 40,
      layout: "vertical",
      selectionStyle: "none" 
    });
    var fname = Ti.UI.createTextField({
      height:40,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('First Name')
    });
    fnameRow.add(fname);
    s1.add(fnameRow);
    // Last Name Field
    var lnameRow = Ti.UI.createTableViewRow({
      height: 40,
      layout: "vertical",
      selectionStyle: "none" 
    });
    var lname = Ti.UI.createTextField({
      height:40,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Last Name')
    });
    lnameRow.add(lname);
    s1.add(lnameRow);
    
    data.push(s1);
    
    var s2 = Ti.UI.createTableViewSection({
      borderColor: 'transparent',
      borderWidth: 0
    });
    var genderRow = Ti.UI.createTableViewRow({
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
      height: 40,
      selectionStyle: "none"
    });
    if (Ti.Platform.osname != 'android') {
      var gender = Titanium.UI.createTabbedBar({
        labels: ['Male', 'Female', 'Couple'],
        backgroundColor: '#336699',
        style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
        height: 45,
        width: 302
      });
      genderRow.add(gender);
    }
    s2.add(genderRow);
    data.push(s2);
    
    // TODO add spacing to front of fields
    var s3 = Ti.UI.createTableViewSection();
    var streetRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "vertical",
      selectionStyle: "none"
    });
    var street = Ti.UI.createTextField({
      height:40,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Street')
    });
    streetRow.add(street);
    s3.add(streetRow);
    var citystateRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "horizontal",
      selectionStyle: "none"
    });
    var city = Ti.UI.createTextField({
      width: 149,
      height:40,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('City')
    });
    var sep1 = Ti.UI.createView({
      width: 1,
      height: 45,
      left: 0,
      backgroundColor: '#cccccc'
    });
    var state = Ti.UI.createTextField({
      width: 149,
      height: 40,
      left: 0,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('State')
    });
    citystateRow.add(city);
    citystateRow.add(sep1);
    citystateRow.add(state);
    s3.add(citystateRow);
    var zipcountryRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "horizontal",
      selectionStyle: "none"
    });
    var zip = Ti.UI.createTextField({
      width: 149,
      height:40,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Zip')
    });
    var sep2 = Ti.UI.createView({
      width: 1,
      height: 45,
      left: 0,
      backgroundColor: '#cccccc'
    });
    // TODO Change to a picker instead of textfield
    var country = Ti.UI.createTextField({
      width: 149,
      height:40,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Country')
    });
    zipcountryRow.add(zip);
    zipcountryRow.add(sep2);
    zipcountryRow.add(country);
    s3.add(zipcountryRow);
    data.push(s3);
    
    // Phone Number section
    var s4 = Ti.UI.createTableViewSection();
    var homeRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "horizontal",
      selectionStyle: "none"
    });
    var homeLabel = Ti.UI.createLabel({
      text: 'Home',
      font: {fontWeight: 'bold', fontSize: 16},
      height: 45,
      width: 75,
      left: 10
    });
    var sep3 = Ti.UI.createView({
      width: 1,
      height: 45,
      left: 0,
      backgroundColor: '#cccccc'
    });
    var homeText = Ti.UI.createTextField({
      width: 200,
      height:40,
      left: 5,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
    });
    homeRow.add(homeLabel);
    homeRow.add(sep3);
    homeRow.add(homeText);
    s4.add(homeRow);
    var mobileRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "horizontal",
      selectionStyle: "none"
    });
    var mobileLabel = Ti.UI.createLabel({
      text: 'Mobile',
      font: {fontWeight: 'bold', fontSize: 16},
      height: 45,
      width: 75,
      left: 10
    });
    var sep4 = Ti.UI.createView({
      width: 1,
      height: 45,
      left: 0,
      backgroundColor: '#cccccc'
    });
    var mobileText = Ti.UI.createTextField({
      width: 200,
      height:40,
      left: 5,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
    });
    mobileRow.add(mobileLabel);
    mobileRow.add(sep4);
    mobileRow.add(mobileText);
    s4.add(mobileRow);
    data.push(s4);
    
    // Email field
    var s5 = Ti.UI.createTableViewSection();
    var emailRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "horizontal",
      selectionStyle: "none"
    });
    var email = Ti.UI.createTextField({
      width: 280,
      height: 40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Email')
    });
    emailRow.add(email);
    s5.add(emailRow);
    data.push(s5);
    
    // Finally Make the TableView and add
    var tableView = Ti.UI.createTableView({
      data: data,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    });
    win.add(tableView);

    return win;
  };
  
  shl.ui.createAllWindow = function() {
    var win = Ti.UI.createWindow({
      title: 'All',
      activity: {
        onCreateOptionsMenu : function(e) {
          var menu = e.menu;
          var m1 = menu.add({title: 'Add'});
          m1.addEventListener('click', function(e) {
            shl.allTab.open(shl.ui.createAddWindow());
          });
        }
      }
    });
    var prospects = shl.db.listAllProspects();
    win.add(shl.ui.createProspectTableView(prospects));
    
    if (Ti.Platform.osname === 'iphone') {
      var b = Ti.UI.createButton({
        systemButton:Ti.UI.iPhone.SystemButton.ADD
      });
      b.addEventListener('click', function() {
        shl.ui.createAddWindow().open({modal:true});
      });
      win.setRightNavButton(b);
    }
    return win;
  };
  
  shl.ui.createListsWindow = function() {
    var win = Ti.UI.createWindow({
      title: 'Lists',
      activity: {
        onCreateOptionsMenu : function(e) {
          var menu = e.menu;
          var m1 = menu.add({title: 'Add'});
          m1.addEventListener('click', function(e) {
            shl.allTab.open(shl.ui.createAddWindow());
          });
        }
      }
    });
    var prospects = shl.db.listAllProspects();
    win.add(shl.ui.createProspectTableView(prospects));
    
    if (Ti.Platform.osname === 'iphone') {
      var b = Ti.UI.createButton({
        title: 'Add',
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
      });
      b.addEventListener('click', function() {
        shl.ui.createAddWindow().open({modal:true});
      });
      win.setRightNavButton(b);
    }
    return win;
  };
  
  shl.ui.createSearchWindow = function() {
    var win = Ti.UI.createWindow({
      title: 'Search',
      activity: {
        onCreateOptionsMenu : function(e) {
          var menu = e.menu;
          var m1 = menu.add({title: 'Add'});
          m1.addEventListener('click', function(e) {
            shl.allTab.open(shl.ui.createAddWindow());
          });
        }
      }
    });
    var prospects = shl.db.listAllProspects();
    win.add(shl.ui.createProspectTableView(prospects));
    
    if (Ti.Platform.osname === 'iphone') {
      var b = Ti.UI.createButton({
        title: 'Add',
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
      });
      b.addEventListener('click', function() {
        shl.ui.createAddWindow().open({modal:true});
      });
      win.setRightNavButton(b);
    }
    return win;
  };
  
  shl.ui.createApplicationTabGroup = function() {
    var tabgroup = Ti.UI.createTabGroup();
    
    // all, lists, search, more
    var all = shl.ui.createAllWindow();
    var lists = shl.ui.createListsWindow();
    var search = shl.ui.createSearchWindow();
    
    shl.allTab = Ti.UI.createTab({
      title: 'All',
      window: all,
      icon: 'images/112-group.png'
    });
    shl.listsTab = Ti.UI.createTab({
      title: 'Lists',
      window: lists,
      icon: 'images/179-notepad.png'
    });
    shl.searchTab = Ti.UI.createTab({
      title: 'Search',
      window: search,
      icon: 'images/06-magnify.png'
    });
    
    tabgroup.addTab(shl.allTab);
    tabgroup.addTab(shl.listsTab);
    tabgroup.addTab(shl.searchTab);
    
    return tabgroup;
  };
})();
