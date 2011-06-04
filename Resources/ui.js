(function() {
  var UI;
  var __hasProp = Object.prototype.hasOwnProperty;
  UI = function() {
    this.isAndroid = Ti.Platform.name === 'android' ? true : false;
    this.platform = Ti.Platform.name;
    this.tabs = this.createApplicationTabGroup();
    return this;
  };
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
    var b, prospects, win;
    win = Ti.UI.createWindow({
      title: 'All',
      activity: {
        onCreateOptionsMenu: function(e) {
          var m1, menu;
          menu = e.menu;
          m1 = menu.add({
            title: 'Add'
          });
          return m1.addEventListener('click', function(e) {
            return alert('clicked');
          });
        }
      }
    });
    prospects = shl.db.listAllProspects();
    win.add(this.createProspectTableView(prospects));
    if (this.platform === 'iphone') {
      b = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.ADD
      });
      b.addEventListener('click', function(e) {
        return alert('clicked');
      });
      win.setRightNavButton(b);
    }
    return win;
  };
  UI.prototype.createStarredWindow = function() {
    return this.createListsWindow();
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
  UI.prototype.createProspectTableView = function(prospects) {
    var _i, _j, _ref, _result, data, i, tableView;
    data = (function() {
      _result = []; _ref = prospects;
      for (_j in _ref) {
        if (!__hasProp.call(_ref, _j)) continue;
        (function() {
          var _ref2, address, addressLabel, content, contentTitle, lastContactLabel, lastContactPretty, row, title;
          var i = _j;
          var _i = _ref[_j];
          return _result.push((function() {
            row = Ti.UI.createTableViewRow({
              height: 'auto',
              hasChild: true
            });
            content = Ti.UI.createView({
              height: 'auto',
              layout: 'vertical',
              left: 10,
              top: 10,
              bottom: 10,
              right: 10
            });
            if (prospects[i].firstMale !== '') {
              title = prospects[i].firstMale;
              if (prospects[i].firstFemale !== '') {
                title += ' and ' + prospects[i].firstFemale;
              }
              if (prospects[i].last !== '') {
                title += ' ' + prospects[i].last;
              }
            } else if (prospects[i].firstFemale !== '') {
              title = _prospects[i].firstFemale;
              if (prospects[i].last !== '') {
                title += ' ' + prospects[i].last;
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
            lastContactPretty = (function() {
              var date, day_diff, diff;
              date = new Date(prospects[i].lastContact * 1000);
              diff = (((new Date()).getTime() - date.getTime()) / 1000);
              day_diff = Math.floor(diff / 86400);
              if (isNaN(day_diff) || day_diff < 0 || (day_diff >= 31)) {
                return '';
              }
              return day_diff === 0 && (diff < 60 && "just now" || diff < 120 && "1 minute ago" || diff < 3600 && Math.floor(diff / 60) + " minutes ago" || diff < 7200 && "1 hour ago" || diff < 86400 && Math.floor(diff / 3600) + " hours ago") || day_diff === 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
            })();
            lastContactLabel = Ti.UI.createLabel({
              text: 'Last Contact: ' + lastContactPretty,
              font: {
                fontWeight: 'normal',
                fontSize: 12
              },
              height: 'auto',
              width: 'auto',
              left: 5
            });
            address = '' + ((typeof (_ref2 = prospects[i].street) !== "undefined" && _ref2 !== null) && prospects[i].street !== '' ? prospects[i].street : '') + ((typeof (_ref2 = prospects[i].city) !== "undefined" && _ref2 !== null) && prospects[i].city !== '' ? "\n" + prospects[i].city : '') + ((typeof (_ref2 = prospects[i].state) !== "undefined" && _ref2 !== null) && prospects[i].state !== '' ? ", " + prospects[i].state : '') + ((typeof (_ref2 = prospects[i].zip) !== "undefined" && _ref2 !== null) && prospects[i].zip !== '' ? " " + prospects[i].zip : '');
            addressLabel = Ti.UI.createLabel({
              text: address,
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
            return row;
          })());
        })();
      }
      return _result;
    })();
    tableView = Ti.UI.createTableView({
      data: data
    });
    tableView.addEventListener('click', function(e) {
      return alert('haha! you thought this would do something didnt you!');
    });
    return tableView;
  };
  shl.ui = new UI();
}).call(this);
