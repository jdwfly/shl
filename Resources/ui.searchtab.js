(function() {
  var SearchTab;

  SearchTab = (function() {

    function SearchTab() {
      this.win = this.createSearchWindow();
      this.tab = Ti.UI.createTab({
        title: 'Search',
        window: this.win,
        icon: 'images/06-magnify.png'
      });
    }

    SearchTab.prototype.createSearchWindow = function() {
      var search, self, tableView, win;
      self = this;
      win = Ti.UI.createWindow({
        title: 'Search'
      });
      search = Titanium.UI.createSearchBar({
        barColor: '#385292',
        showCancel: false,
        hintText: 'search'
      });
      search.addEventListener('change', function(e) {
        return e.value;
      });
      search.addEventListener('return', function(e) {
        return search.blur();
      });
      search.addEventListener('cancel', function(e) {
        return search.blur();
      });
      tableView = shl.ui.createProspectTableView(shl.Prospect.find());
      tableView.search = search;
      tableView.searchHidden = false;
      tableView.filterAttribute = 'searchTerm';
      win.addEventListener('focus', function(g) {
        var data;
        data = shl.ui.processProspectData(shl.Prospect.find());
        return tableView.setData(data);
      });
      win.add(tableView);
      return win;
    };

    return SearchTab;

  })();

  shl.searchTab = new SearchTab;

}).call(this);
