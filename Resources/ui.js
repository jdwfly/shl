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
      var attendedRow, b, city, citystateRow, country, data, email, emailRow, enrolledRow, fname, fnameRow, gender, genderRow, homeLabel, homeRow, homeText, initContactLabel, initialContactRow, initialPicker, lname, lnameRow, mobileLabel, mobileRow, mobileText, pocRow, pocTextfield, prevBaptRow, prevSavedRow, s1, s2, s3, s4, s5, s6, s7, sep1, sep2, sep3, sep4, sep5, state, street, streetRow, tableView, webView, win, zip, zipcountryRow;
      if (this.isAndroid) {
        win = Ti.UI.createWindow({
          title: 'Add Prospect'
        });
        webView = Ti.UI.createWebView({
          url: 'addProspect.html'
        });
        Ti.App.addEventListener('webToTi', function(e) {
          return Ti.API.info('webToTi Sent: ' + JSON.stringify(e));
        });
        win.add(webView);
        return win;
      }
      win = Ti.UI.createWindow({
        title: 'Add Prospect',
        backgroundColor: '#eeeeee'
      });
      data = [];
      s1 = Ti.UI.createTableViewSection();
      fnameRow = Ti.UI.createTableViewRow({
        height: 40,
        layout: "vertical",
        selectionStyle: "none"
      });
      fname = Ti.UI.createTextField({
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('First Name')
      });
      fnameRow.add(fname);
      s1.add(fnameRow);
      lnameRow = Ti.UI.createTableViewRow({
        height: 40,
        layout: "vertical",
        selectionStyle: "none"
      });
      lname = Ti.UI.createTextField({
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('Last Name')
      });
      lnameRow.add(lname);
      s1.add(lnameRow);
      data.push(s1);
      s2 = Ti.UI.createTableViewSection({
        borderColor: 'transparent',
        borderWidth: 0
      });
      genderRow = Ti.UI.createTableViewRow({
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderColor: 'transparent',
        height: 40,
        selectionStyle: "none"
      });
      if (this.platform === 'iPhone OS') {
        gender = Titanium.UI.createTabbedBar({
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
      s3 = Ti.UI.createTableViewSection();
      streetRow = Ti.UI.createTableViewRow({
        height: 45,
        layout: "vertical",
        selectionStyle: "none"
      });
      street = Ti.UI.createTextField({
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('Street')
      });
      streetRow.add(street);
      s3.add(streetRow);
      citystateRow = Ti.UI.createTableViewRow({
        height: 45,
        layout: "horizontal",
        selectionStyle: "none"
      });
      city = Ti.UI.createTextField({
        width: 139,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('City')
      });
      sep1 = Ti.UI.createView({
        width: 1,
        height: 45,
        left: 0,
        backgroundColor: '#cccccc'
      });
      state = Ti.UI.createTextField({
        width: 139,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('State')
      });
      citystateRow.add(city);
      citystateRow.add(sep1);
      citystateRow.add(state);
      s3.add(citystateRow);
      zipcountryRow = Ti.UI.createTableViewRow({
        height: 45,
        layout: "horizontal",
        selectionStyle: "none"
      });
      zip = Ti.UI.createTextField({
        width: 139,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('Zip')
      });
      sep2 = Ti.UI.createView({
        width: 1,
        height: 45,
        left: 0,
        backgroundColor: '#cccccc'
      });
      country = Ti.UI.createTextField({
        width: 139,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('Country')
      });
      zipcountryRow.add(zip);
      zipcountryRow.add(sep2);
      zipcountryRow.add(country);
      s3.add(zipcountryRow);
      data.push(s3);
      s4 = Ti.UI.createTableViewSection();
      homeRow = Ti.UI.createTableViewRow({
        height: 45,
        layout: "horizontal",
        selectionStyle: "none"
      });
      homeLabel = Ti.UI.createLabel({
        text: 'Home',
        font: {
          fontWeight: 'bold',
          fontSize: 16
        },
        height: 45,
        width: 75,
        left: 10
      });
      sep3 = Ti.UI.createView({
        width: 1,
        height: 45,
        left: 0,
        backgroundColor: '#cccccc'
      });
      homeText = Ti.UI.createTextField({
        width: 200,
        height: 40,
        left: 5,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE
      });
      homeRow.add(homeLabel);
      homeRow.add(sep3);
      homeRow.add(homeText);
      s4.add(homeRow);
      mobileRow = Ti.UI.createTableViewRow({
        height: 45,
        layout: "horizontal",
        selectionStyle: "none"
      });
      mobileLabel = Ti.UI.createLabel({
        text: 'Mobile',
        font: {
          fontWeight: 'bold',
          fontSize: 16
        },
        height: 45,
        width: 75,
        left: 10
      });
      sep4 = Ti.UI.createView({
        width: 1,
        height: 45,
        left: 0,
        backgroundColor: '#cccccc'
      });
      mobileText = Ti.UI.createTextField({
        width: 200,
        height: 40,
        left: 5,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE
      });
      mobileRow.add(mobileLabel);
      mobileRow.add(sep4);
      mobileRow.add(mobileText);
      s4.add(mobileRow);
      data.push(s4);
      s5 = Ti.UI.createTableViewSection();
      emailRow = Ti.UI.createTableViewRow({
        height: 45,
        layout: "horizontal",
        selectionStyle: "none"
      });
      email = Ti.UI.createTextField({
        width: 280,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('Email')
      });
      emailRow.add(email);
      s5.add(emailRow);
      data.push(s5);
      s6 = Ti.UI.createTableViewSection();
      initialContactRow = Ti.UI.createTableViewRow({
        height: 45,
        layout: 'horizontal',
        selectionSytle: 'none'
      });
      initContactLabel = Ti.UI.createLabel({
        text: 'Initial Contact',
        font: {
          fontWeight: 'bold',
          fontSize: 16
        },
        height: 45,
        width: 160,
        left: 10
      });
      sep5 = Ti.UI.createView({
        width: 1,
        height: 45,
        left: 0,
        backgroundColor: '#cccccc'
      });
      initialPicker = Ti.UI.createTextField({
        height: 45,
        width: 120,
        left: 7,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('1/10/2011')
      });
      initialContactRow.add(initContactLabel);
      initialContactRow.add(sep5);
      initialContactRow.add(initialPicker);
      s6.add(initialContactRow);
      pocRow = Ti.UI.createTableViewRow({
        height: 45,
        layout: 'horizontal',
        selectionSytle: 'none'
      });
      pocTextfield = Ti.UI.createTextField({
        width: 280,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('Point of Contact')
      });
      pocRow.add(pocTextfield);
      s6.add(pocRow);
      data.push(s6);
      s7 = Ti.UI.createTableViewSection();
      prevSavedRow = Ti.UI.createTableViewRow({
        title: 'Previously Saved',
        hasCheck: false
      });
      prevBaptRow = Ti.UI.createTableViewRow({
        title: 'Previously Baptized',
        hasCheck: false
      });
      attendedRow = Ti.UI.createTableViewRow({
        title: 'Attended Church',
        hasCheck: false
      });
      enrolledRow = Ti.UI.createTableViewRow({
        title: 'Enrolled in Sunday School',
        hasCheck: false
      });
      s7.add(prevSavedRow);
      s7.add(prevBaptRow);
      s7.add(attendedRow);
      s7.add(enrolledRow);
      s7.addEventListener('click', function(e) {
        if (e.row.hasCheck) {
          return e.row.hasCheck = false;
        } else {
          return e.row.hasCheck = true;
        }
      });
      data.push(s7);
      if (this.platform === 'iPhone OS') {
        b = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.SAVE
        });
        b.addEventListener('click', function() {
          var createdProspect;
          createdProspect = shl.Prospect.create({
            last: lname.value,
            firstMale: fname.value,
            street: street.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
            country: country.value,
            phoneHome: homeText.value,
            phoneMoble: mobileText.value,
            email: email.value,
            firstContactDate: initialPicker.value,
            firstContactPoint: pocTextfield.value,
            previouslySaved: prevSavedRow.hasCheck,
            previouslyBaptized: prevBaptRow.hasCheck,
            attended: attendedRow.hasCheck,
            sundaySchool: enrolledRow.hasCheck
          });
          Ti.API.info(createdProspect.toJSON());
          fname.value = '';
          lname.value = '';
          street.value = '';
          city.value = '';
          state.value = '';
          zip.value = '';
          country.value = '';
          homeText.value = '';
          mobileText.value = '';
          email.value = '';
          initialPicker.value = '';
          pocTextfield.value = '';
          prevSavedRow.hasCheck = false;
          prevBaptRow.hasCheck = false;
          attendedRow.hasCheck = false;
          return enrolledRow.hasCheck = false;
        });
        win.setRightNavButton(b);
      }
      tableView = Ti.UI.createTableView({
        data: data,
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      });
      win.add(tableView);
      return win;
    };
    UI.prototype.createSearchWindow = function() {
      var result, search, self, win;
      self = this;
      win = Ti.UI.createWindow({
        title: 'Search'
      });
      search = Titanium.UI.createSearchBar({
        barColor: '#000',
        backgroundColor: '#000',
        showCancel: true,
        height: 43,
        top: 0
      });
      win.add(search);
      search.addEventListener('cancel', function(e) {
        return search.blur();
      });
      search.addEventListener('return', function(e) {
        return search.blur();
      });
      result = this.createProspectTableView([]);
      result.height = 280;
      win.add(result);
      search.addEventListener('return', function(e) {
        var prospects;
        prospects = shl.Prospect.search(e.value);
        return result.updateProspects(prospects);
      });
      return win;
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
      var data, self, tableView;
      self = this;
      data = this.processProspectData(prospects);
      tableView = Ti.UI.createTableView({
        data: data
      });
      tableView.addEventListener('click', function(e) {
        var prospectWin;
        Ti.API.info(JSON.stringify(e.row));
        prospectWin = self.createProspectViewWindow(e.row.prospect);
        return self.tabs.activeTab.open(prospectWin);
      });
      tableView.updateProspects = function(prospects) {
        data = self.processProspectData(prospects);
        return this.setData(data);
      };
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
    UI.prototype.processProspectData = function(prospects) {
      var addressLabel, content, contentTitle, data, lastContactLabel, prospect, row;
      if (prospects.length < 1) {
        return [];
      }
      return data = (function() {
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
          contentTitle = Ti.UI.createLabel({
            text: prospect.formatName(),
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
    };
    return UI;
  })();
  shl.ui = new UI;
}).call(this);
