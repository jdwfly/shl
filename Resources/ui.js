(function() {
  var UI;
  UI = (function() {
    function UI() {
      this.isAndroid = Ti.Platform.name === 'android' ? true : false;
      this.platform = Ti.Platform.name;
      this.tabs = this.createApplicationTabGroup();
    }
    UI.prototype.createApplicationTabGroup = function() {
      var add, addTab, help, helpTab, lists, listsTab, nearby, nearbyTab, search, searchTab, settings, settingsTab, starred, starredTab, tabs;
      tabs = Ti.UI.createTabGroup();
      lists = this.createListsWindow();
      starred = this.createStarredWindow();
      add = this.createAddWindow();
      search = this.createSearchWindow();
      nearby = this.createNearbyWindow();
      settings = this.createSettingsWindow();
      help = this.createHelpWindow();
      listsTab = Ti.UI.createTab({
        title: 'Lists',
        window: lists,
        icon: 'images/179-notepad.png'
      });
      starredTab = Ti.UI.createTab({
        title: 'Starred',
        window: starred,
        icon: 'images/28-star.png'
      });
      addTab = Ti.UI.createTab({
        title: 'Add',
        window: add,
        icon: 'images/13-plus.png'
      });
      searchTab = Ti.UI.createTab({
        title: 'Search',
        window: search,
        icon: 'images/06-magnify.png'
      });
      nearbyTab = Ti.UI.createTab({
        title: 'Nearby',
        window: nearby,
        icon: 'images/73-radar.png'
      });
      settingsTab = Ti.UI.createTab({
        title: 'Settings',
        window: settings,
        icon: 'images/20-gear2.png'
      });
      helpTab = Ti.UI.createTab({
        title: 'Help',
        window: help,
        icon: 'images/90-life-buoy.png'
      });
      tabs.addTab(listsTab);
      tabs.addTab(starredTab);
      tabs.addTab(addTab);
      tabs.addTab(searchTab);
      tabs.addTab(nearbyTab);
      tabs.addTab(settingsTab);
      tabs.addTab(helpTab);
      tabs.open();
      return tabs;
    };
    UI.prototype.createListsWindow = function() {
      var cancel, edit, lists, self, tableView, win;
      self = this;
      win = Ti.UI.createWindow({
        title: 'Lists',
        activity: {
          onCreateOptionsMenu: function(e) {
            var m1, m2, menu;
            menu = e.menu;
            m1 = menu.add({
              title: 'Add Prospect'
            });
            m2 = menu.add({
              title: 'Add List'
            });
            m1.addEventListener('click', function(e) {
              return alert('clicked');
            });
            return m2.addEventListener('click', function(e) {
              return alert('clicked');
            });
          }
        }
      });
      lists = shl.List.find({
        where: {
          active: 1
        },
        order: 'weight ASC'
      });
      Ti.API.info('lists = ' + lists.toJSON());
      tableView = this.createListTableView(lists);
      win.add(tableView);
      if (this.platform === 'iPhone OS') {
        edit = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.EDIT
        });
        edit.addEventListener('click', function(e) {
          win.setRightNavButton(cancel);
          return tableView.editing = true;
        });
        cancel = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.DONE,
          title: 'Cancel'
        });
        cancel.addEventListener('click', function(e) {
          win.setRightNavButton(edit);
          return tableView.editing = false;
        });
        win.setRightNavButton(edit);
      }
      return win;
    };
    UI.prototype.createStarredWindow = function() {
      var prospects, win;
      win = Ti.UI.createWindow({
        title: 'Starred'
      });
      prospects = shl.Prospect.find({
        where: {
          starred: 1
        },
        order: 'id ASC'
      });
      Ti.API.info('prospects = ' + prospects.toJSON());
      win.add(this.createProspectTableView(prospects));
      return win;
    };
    UI.prototype.createAddWindow = function() {
      return this.createListsWindow();
    };
    UI.prototype.createSearchWindow = function() {
      return this.createListsWindow();
    };
    UI.prototype.createNearbyWindow = function() {
      return this.createListsWindow();
    };
    UI.prototype.createSettingsWindow = function() {
      return this.createListsWindow();
    };
    UI.prototype.createHelpWindow = function() {
      return this.createListsWindow();
    };
    UI.prototype.createListTableView = function(lists) {
      var addCustom, data, i, row, self, tableView;
      self = this;
      data = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = lists.length; _i < _len; _i++) {
          i = lists[_i];
          _results.push(row = Ti.UI.createTableViewRow({
            height: 'auto',
            hasChild: true,
            title: i.name,
            listID: i.id,
            editable: false,
            moveable: true
          }));
        }
        return _results;
      })();
      addCustom = Ti.UI.createTableViewRow({
        height: 'auto',
        title: 'Create Custom List...',
        listID: 'custom',
        editable: false,
        moveable: false
      });
      data.push(addCustom);
      tableView = Ti.UI.createTableView({
        data: data,
        moveable: true
      });
      tableView.addEventListener('click', function(e) {
        var listWin, prospects;
        Ti.API.info(JSON.stringify(e.row));
        if (e.row.listID === 'custom') {
          alert('add a list');
        }
        listWin = Ti.UI.createWindow();
        if (shl.aLists[e.row.title] != null) {
          listWin.title = e.row.title;
          prospects = shl.Prospect.find(shl.aLists[e.row.title].query);
          Ti.API.info('prospects = ' + prospects.toJSON());
          listWin.add(self.createProspectTableView(prospects));
          return self.tabs.activeTab.open(listWin);
        }
      });
      tableView.addEventListener('move', function(e) {
        var list;
        Ti.API.info(JSON.stringify(e.index));
        list = shl.List.find(e.row.listID);
        list.set('weight', e.index);
        return Ti.API.info(list.toJSON());
      });
      tableView.addEventListener('delete', function(e) {
        return alert(JSON.stringify(e.row));
      });
      return tableView;
    };
    UI.prototype.createProspectTableView = function(prospects) {
      var addressLabel, content, contentTitle, data, lastContactLabel, prospect, row, self, tableView, title;
      self = this;
      if (prospects.length < 1) {
        return Ti.UI.createLabel({
          text: 'None'
        });
      }
      data = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = prospects.length; _i < _len; _i++) {
          prospect = prospects[_i];
          row = Ti.UI.createTableViewRow({
            height: 'auto',
            hasDetail: true
          });
          content = Ti.UI.createView({
            height: 'auto',
            layout: 'vertical',
            left: 10,
            top: 10,
            bottom: 10,
            right: 10
          });
          if (prospect.firstMale !== '') {
            title = prospect.firstMale;
            if (prospect.firstFemale !== '') {
              title += ' and ' + prospect.firstFemale;
            }
            if (prospect.last !== '') {
              title += ' ' + prospect.last;
            }
          } else if (prospect.firstFemale !== '') {
            title = prospect.firstFemale;
            if (prospect.last !== '') {
              title += ' ' + prospect.last;
            }
          }
          contentTitle = Ti.UI.createLabel({
            text: title,
            font: {
              fontWeight: 'bold',
              fontSize: 18
            },
            height: 'auto',
            width: 'auto',
            left: 5
          });
          lastContactLabel = Ti.UI.createLabel({
            text: 'Last Contact: ' + prospect.formatContactPretty(),
            font: {
              fontWeight: 'normal',
              fontSize: 12
            },
            height: 'auto',
            width: 'auto',
            left: 5
          });
          addressLabel = Ti.UI.createLabel({
            text: prospect.formatAddress(),
            font: {
              fontWeight: 'normal',
              fontSize: 12
            },
            height: 'auto',
            width: 'auto',
            left: 5
          });
          content.add(contentTitle);
          content.add(lastContactLabel);
          content.add(addressLabel);
          row.add(content);
          row.prospect = prospect;
          _results.push(row);
        }
        return _results;
      })();
      tableView = Ti.UI.createTableView({
        data: data
      });
      tableView.addEventListener('click', function(e) {
        var prospectWin;
        Ti.API.info(JSON.stringify(e.row));
        prospectWin = self.createProspectViewWindow(e.row.prospect);
        return self.tabs.activeTab.open(prospectWin);
      });
      return tableView;
    };
    UI.prototype.createProspectViewWindow = function(prospect) {
      var testLabel, win;
      win = Ti.UI.createWindow();
      testLabel = Ti.UI.createLabel({
        text: prospect.formatName()
      });
      win.add(testLabel);
      return win;
    };
    return UI;
  })();
  shl.ui = new UI;
}).call(this);
