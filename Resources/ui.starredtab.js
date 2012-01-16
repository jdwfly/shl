(function() {
  var StarredTab;

  StarredTab = (function() {

    function StarredTab() {
      this.win = this.createStarredWindow();
      this.tab = Ti.UI.createTab({
        title: 'Starred',
        window: this.win,
        icon: 'images/28-star.png'
      });
    }

    StarredTab.prototype.createStarredWindow = function() {
      var prospects, starList, tableView, win;
      win = Ti.UI.createWindow({
        title: 'Starred'
      });
      starList = shl.List.find(1);
      prospects = starList.getProspectList();
      Ti.API.info('prospects = ' + prospects);
      tableView = shl.ui.createProspectTableView(prospects);
      win.addEventListener('click', function(e) {
        var dataSourceString;
        dataSourceString = e.source + '';
        if (dataSourceString.indexOf('TiUIImageView') !== -1) {
          win.fireEvent('focus');
          return true;
        }
      });
      win.add(tableView);
      win.addEventListener('focus', function(e) {
        prospects = starList.getProspectList();
        return tableView.updateProspects(prospects);
      });
      return win;
    };

    return StarredTab;

  })();

  shl.starredTab = new StarredTab;

}).call(this);
