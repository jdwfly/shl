(function() {
  shl.ui = {};
  
  shl.ui.createProspectTableView = function() {
    var data = [{title:"Row 1"},{title:"Row 2"}];
    return Titanium.UI.createTableView({data:data});
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
      window: all
    });
    shl.listsTab = Ti.UI.createTab({
      title: 'Lists',
      window: lists
    });
    shl.searchTab = Ti.UI.createTab({
      title: 'Search',
      window: search
    });
    shl.moreTab = Ti.UI.createTab({
      title: 'More',
      window: more
    });
    
    tabgroup.addTab(shl.allTab);
    tabgroup.addTab(shl.listsTab);
    tabgroup.addTab(shl.searchTab);
    tabgroup.addTab(shl.moreTab);
    
    return tabgroup;
  };
})();
