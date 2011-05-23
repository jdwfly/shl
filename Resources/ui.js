(function() {
  shl.ui = {};
  
  shl.ui.createProspectTableView = function() {
    var data = [{title:"Row 1"},{title:"Row 2"}];
    return Titanium.UI.createTableView({data:data});
  };
  
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
    var gender = Titanium.UI.createTabbedBar({
      labels: ['Male', 'Female', 'Couple'],
      backgroundColor: '#336699',
      style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
      height: 45,
      width: 302
    });
    genderRow.add(gender);
    s2.add(genderRow);
    data.push(s2);
    
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
      width: 150,
      height:40,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('City')
    });
    var state = Ti.UI.createTextField({
      width: 150,
      height: 40,
      left: 0,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('State')
    });
    citystateRow.add(city);
    citystateRow.add(state);
    s3.add(citystateRow);
    data.push(s3);
    
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
    win.add(shl.ui.createProspectTableView());
    
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
    win.add(shl.ui.createProspectTableView());
    
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
    win.add(shl.ui.createProspectTableView());
    
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
  
  shl.ui.createMoreWindow = function() {
    var win = Ti.UI.createWindow({
      title: 'More',
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
    win.add(shl.ui.createProspectTableView());
    
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
    var more = shl.ui.createMoreWindow();
    
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
    shl.moreTab = Ti.UI.createTab({
      title: 'More',
      window: more,
      icon: 'images/59-info.png'
    });
    
    tabgroup.addTab(shl.allTab);
    tabgroup.addTab(shl.listsTab);
    tabgroup.addTab(shl.searchTab);
    tabgroup.addTab(shl.moreTab);
    
    return tabgroup;
  };
})();
