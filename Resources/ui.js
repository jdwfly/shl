(function() {
  shl.ui = {};
  
  shl.ui.createApplicationTabGroup = function() {
    var tabgroup = Ti.UI.createTabGroup();
    
    // all, lists, search, more
    var all = shl.ui.createAllWindow();
    var lists = shl.ui.createListsWindow();
    var search = shl.ui.createSearchWindow();
    var more = shl.ui.createMoreWindow();
    
    shl.allTab = Ti.UI.createTab({
      
    });
    shl.listsTab = Ti.UI.createTab({
      
    });
    shl.searchTab = Ti.UI.createTab({
      
    });
    shl.moreTab = Ti.UI.createTab({
      
    });
    
    tabgroup.addTab(shl.allTab);
    tabgroup.addTab(shl.listsTab);
    tabgroup.addTab(shl.searchTab);
    tabgroup.addTab(shl.moreTab);
    
    return tabgroup;
  };
})();
