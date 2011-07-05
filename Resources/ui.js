(function() {
  var UI;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  UI = (function() {
    function UI() {
      this.isAndroid = Ti.Platform.name === 'android' ? true : false;
      this.platform = Ti.Platform.name;
      this.tabs = this.createApplicationTabGroup();
    }
    UI.prototype.createApplicationTabGroup = function() {
      var add, addTab, help, lists, listsTab, nearby, search, searchTab, settings, starred, starredTab, tabs;
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
      /*
          nearbyTab = Ti.UI.createTab({
            title: 'Nearby',
            window: nearby,
            icon: 'images/73-radar.png'
          })
          settingsTab = Ti.UI.createTab({
            title: 'Settings',
            window: settings,
            icon: 'images/20-gear2.png'
          })
          helpTab = Ti.UI.createTab({
            title: 'Help',
            window: help,
            icon: 'images/90-life-buoy.png'
          })
          */
      tabs.addTab(listsTab);
      tabs.addTab(starredTab);
      tabs.addTab(addTab);
      tabs.addTab(searchTab);
      tabs.open({
        transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
      });
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
          var allLists;
          win.setRightNavButton(cancel);
          allLists = shl.List.find({
            order: 'weight ASC'
          });
          tableView.updateLists(allLists);
          return tableView.editing = true;
        });
        cancel = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.DONE,
          title: 'Done'
        });
        cancel.addEventListener('click', function(e) {
          win.setRightNavButton(edit);
          tableView.editing = false;
          lists = shl.List.find({
            where: {
              active: 1
            },
            order: 'weight ASC'
          });
          return tableView.updateLists(lists);
        });
      }
      win.addEventListener('open', function(e) {
        return win.addEventListener('focus', function(e) {
          lists = shl.List.find({
            where: {
              active: 1
            },
            order: 'weight ASC'
          });
          return tableView.updateLists(lists);
        });
      });
      return win;
    };
    UI.prototype.createStarredWindow = function() {
      var prospects, starList, tableView, win;
      win = Ti.UI.createWindow({
        title: 'Starred'
      });
      starList = shl.List.find(1);
      prospects = starList.getProspectList();
      Ti.API.info('prospects = ' + prospects);
      tableView = this.createProspectTableView(prospects);
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
    UI.prototype.createAddWindow = function() {
      var webView, win;
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
      win = this.createProspectFormWin();
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
    UI.prototype.createAddProspectsWindow = function(listId) {
      var createRow, data, doneBtn, prospect, prospects, self, tableView, win;
      self = this;
      win = Ti.UI.createWindow({
        title: 'Add Prospects'
      });
      doneBtn = Ti.UI.createButton({
        title: 'Done',
        width: 100,
        height: 30
      });
      doneBtn.addEventListener('click', function() {
        return win.close();
      });
      win.setRightNavButton(doneBtn);
      prospects = shl.Prospect.find();
      if (prospects.length < 1) {
        return win;
      }
      createRow = function(prospect) {
        var addBtn, addressLabel, contentTitle, currentList, deleteBtn, listMembers, prosp, prospectsList, row, _ref;
        row = Ti.UI.createTableViewRow({
          height: 70
        });
        contentTitle = Ti.UI.createLabel({
          text: prospect.formatName(),
          font: {
            fontWeight: 'bold',
            fontSize: 18
          },
          height: 30,
          top: 5,
          width: 'auto',
          left: 5
        });
        addressLabel = Ti.UI.createLabel({
          text: prospect.formatAddress(),
          font: {
            fontWeight: 'normal',
            fontSize: 12
          },
          height: 35,
          width: 'auto',
          height: 'auto',
          top: 33,
          left: 5,
          bottom: 5
        });
        row.add(contentTitle);
        row.add(addressLabel);
        row.prospect = prospect;
        addBtn = Ti.UI.createButton({
          backgroundImage: '/images/addDefault.png',
          height: 27,
          width: 27,
          right: 10,
          top: 20
        });
        addBtn.addEventListener('click', function() {
          Ti.API.info(prospect);
          shl.Listing.create({
            list_id: listId,
            prospect_id: prospect.id
          });
          row.backgroundColor = '#AAAAAA';
          setTimeout(function() {
            return deleteBtn.show();
          }, 100);
          addBtn.hide();
          contentTitle.animate({
            left: 50,
            duration: 100
          });
          return addressLabel.animate({
            left: 50,
            duration: 100
          });
        });
        row.add(addBtn);
        deleteBtn = Ti.UI.createButton({
          backgroundImage: '/images/minusDefault.png',
          height: 27,
          width: 27,
          left: 10,
          top: 20,
          visible: false
        });
        deleteBtn.addEventListener('click', function() {
          var listing, todelete, _i, _len;
          todelete = shl.Listing.find({
            where: {
              prospect_id: prospect.id,
              list_id: listId
            }
          });
          for (_i = 0, _len = todelete.length; _i < _len; _i++) {
            listing = todelete[_i];
            listing.destroy();
          }
          row.backgroundColor = '#ffffff';
          deleteBtn.hide();
          addBtn.show();
          contentTitle.animate({
            left: 10,
            duration: 100
          });
          return addressLabel.animate({
            left: 10,
            duration: 100
          });
        });
        row.add(deleteBtn);
        currentList = shl.List.find(listId);
        prospectsList = currentList.getProspectList();
        listMembers = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = prospectsList.length; _i < _len; _i++) {
            prosp = prospectsList[_i];
            _results.push(prosp.id);
          }
          return _results;
        })();
        if (_ref = prospect.id, __indexOf.call(listMembers, _ref) >= 0) {
          deleteBtn.visible = true;
          addBtn.visible = false;
          contentTitle.left = 55;
          addressLabel.left = 55;
        }
        return row;
      };
      data = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = prospects.length; _i < _len; _i++) {
          prospect = prospects[_i];
          _results.push(createRow(prospect));
        }
        return _results;
      })();
      tableView = Ti.UI.createTableView({
        data: data
      });
      win.add(tableView);
      return win;
    };
    UI.prototype.createListTableView = function(lists) {
      var data, self, tableView;
      self = this;
      data = this.processListData(lists);
      tableView = Ti.UI.createTableView({
        data: data,
        moveable: true
      });
      tableView.addEventListener('click', function(e) {
        var addW, allLists, b, c, currentList, index, listWin, listcancel, listedit, listview, lname, newRow, prospects, query;
        Ti.API.info(JSON.stringify(e.row));
        if (e.row.listID === 'custom') {
          addW = Ti.UI.createWindow({
            title: 'New Custom List',
            backgroundColor: '#BBBBBB'
          });
          lname = Ti.UI.createTextField({
            height: 40,
            width: 300,
            top: 10,
            backgroundColor: '#ffffff',
            keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
            returnKeyType: Titanium.UI.RETURNKEY_DONE,
            borderStyle: Titanium.UI.INPUT_BORDERSTYLE_BEZEL,
            hintText: L('List Name')
          });
          addW.add(lname);
          b = Ti.UI.createButton({
            width: 300,
            height: 57,
            top: 60,
            title: 'Save',
            color: '#fff',
            backgroundImage: '/images/button_blue.png'
          });
          b.addEventListener('click', function() {
            var createdList;
            createdList = shl.List.create({
              name: lname.value,
              weight: 0,
              active: 1
            });
            return addW.close();
          });
          addW.add(b);
          c = Ti.UI.createButton({
            width: 300,
            height: 57,
            top: 125,
            title: 'Cancel',
            color: '#fff',
            backgroundImage: '/images/button_blue.png'
          });
          c.addEventListener('click', function() {
            return addW.close();
          });
          addW.add(c);
          addW.open({
            modal: true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
          });
          return true;
        }
        if (e.row.listID === 'more') {
          allLists = shl.List.find({
            order: 'weight ASC'
          });
          tableView.updateLists(allLists);
          index = tableView.getIndexByName('more');
          tableView.deleteRow(index);
          newRow = Ti.UI.createTableViewRow({
            height: 'auto',
            title: 'Hide Extra Lists',
            listID: 'less',
            editable: false,
            moveable: false,
            name: 'less'
          });
          tableView.appendRow(newRow);
          return true;
        }
        if (e.row.listID === 'less') {
          allLists = shl.List.find({
            where: {
              active: 1
            },
            order: 'weight ASC'
          });
          tableView.updateLists(allLists);
          return true;
        }
        listWin = Ti.UI.createWindow();
        listWin.addEventListener('open', function(f) {
          return listWin.addEventListener('focus', function(g) {
            var currentList, prospects;
            if (typeof query !== "undefined" && query !== null) {
              prospects = shl.Prospect.find(query);
            } else {
              currentList = shl.List.find(e.row.listID);
              prospects = currentList.getProspectList();
              listWin.setRightNavButton(listedit);
              listview.editing = false;
            }
            data = self.processProspectData(prospects);
            return listview.setData(data);
          });
        });
        if (shl.aLists[e.row.title] != null) {
          listWin.title = e.row.title;
          query = shl.aLists[e.row.title].query;
          prospects = shl.Prospect.find(shl.aLists[e.row.title].query);
          Ti.API.info('prospects = ' + prospects.toJSON());
          listview = self.createProspectTableView(prospects);
          listWin.add(listview);
          return self.tabs.activeTab.open(listWin);
        } else {
          listWin.title = e.row.title;
          currentList = shl.List.find(e.row.listID);
          Ti.API.info('currentList = ' + currentList.toJSON());
          Ti.API.info('currentList = ' + JSON.stringify(ActiveRecord));
          prospects = currentList.getProspectList();
          Ti.API.info('prospects = ' + JSON.stringify(prospects));
          listview = self.createProspectTableView(prospects);
          listview.deleteButtonTitle = 'Remove';
          listview.editable = true;
          listview.allowsSelectionDuringEditing = true;
          listview.addEventListener('delete', function(e) {
            var currentListing;
            currentListing = shl.Listing.find({
              first: true,
              where: {
                list_id: currentList.id,
                prospect_id: e.row.prospect.id
              }
            });
            return currentListing.destroy();
          });
          listWin.add(listview);
          listedit = Titanium.UI.createButton({
            title: 'Edit'
          });
          listedit.addEventListener('click', function() {
            var addBtn, brow, clearBtn, deleteBtn, editBtns;
            listWin.setRightNavButton(listcancel);
            listview.editing = true;
            brow = Ti.UI.createTableViewRow({
              backgroundColor: '#999',
              height: 50,
              editable: false,
              name: 'options'
            });
            editBtns = Ti.UI.createView({
              height: 50,
              width: 300,
              layout: 'horizontal'
            });
            addBtn = Ti.UI.createButton({
              title: 'Add',
              width: 88,
              height: 38,
              left: 9,
              top: 6
            });
            addBtn.addEventListener('click', function() {
              var addProspectsWin;
              addProspectsWin = self.createAddProspectsWindow(e.row.listID);
              return addProspectsWin.open({
                modal: true,
                modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
                modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
              });
            });
            clearBtn = Ti.UI.createButton({
              title: 'Clear',
              width: 88,
              height: 38,
              left: 9,
              top: 6
            });
            clearBtn.addEventListener('click', function() {
              var a;
              a = Titanium.UI.createAlertDialog({
                title: 'Clear list?',
                buttonNames: ['OK', 'Cancel'],
                cancel: 1
              });
              a.addEventListener('click', function(g) {
                var listing, listings, _i, _len;
                Ti.API.info(e.index);
                if (g.index === 0) {
                  listings = currentList.getListingList();
                  for (_i = 0, _len = listings.length; _i < _len; _i++) {
                    listing = listings[_i];
                    listing.destroy();
                  }
                  currentList = shl.List.find(e.row.listID);
                  prospects = currentList.getProspectList();
                  listWin.setRightNavButton(listedit);
                  listview.editing = false;
                  data = self.processProspectData(prospects);
                  return listview.setData(data);
                }
              });
              return a.show();
            });
            deleteBtn = Ti.UI.createButton({
              title: 'Delete',
              width: 88,
              height: 38,
              left: 9,
              top: 6
            });
            deleteBtn.addEventListener('click', function(g) {
              var a;
              a = Titanium.UI.createAlertDialog({
                title: 'Delete list?',
                buttonNames: ['OK', 'Cancel'],
                cancel: 1
              });
              a.addEventListener('click', function(g) {
                var listing, listings, _i, _len;
                Ti.API.info(e.index);
                if (g.index === 0) {
                  listings = currentList.getListingList();
                  for (_i = 0, _len = listings.length; _i < _len; _i++) {
                    listing = listings[_i];
                    listing.destroy();
                  }
                  currentList.destroy();
                  return listWin.close();
                }
              });
              return a.show();
            });
            editBtns.add(addBtn);
            editBtns.add(clearBtn);
            editBtns.add(deleteBtn);
            brow.add(editBtns);
            if (listview.data[0] && listview.data[0].rows.length >= 1) {
              return listview.insertRowBefore(0, brow);
            } else {
              return listview.appendRow(brow);
            }
          });
          listcancel = Titanium.UI.createButton({
            title: 'Done',
            style: Titanium.UI.iPhone.SystemButtonStyle.DONE
          });
          listcancel.addEventListener('click', function() {
            listWin.setRightNavButton(listedit);
            listview.editing = false;
            index = listview.getIndexByName('options');
            return listview.deleteRow(index, {
              animationStyle: Titanium.UI.iPhone.RowAnimationStyle.UP
            });
          });
          listWin.setRightNavButton(listedit);
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
      tableView.updateLists = function(lists) {
        data = self.processListData(lists);
        return this.setData(data);
      };
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
        var dataSourceString, prospectWin;
        dataSourceString = e.source + '';
        if (dataSourceString.indexOf('TiUIImageView') !== -1) {
          return true;
        }
        if (!tableView.editing) {
          Ti.API.info(JSON.stringify(e.row));
          prospectWin = self.createProspectViewWindow(e.row.prospect);
          return self.tabs.activeTab.open(prospectWin);
        }
      });
      tableView.updateProspects = function(prospects) {
        data = self.processProspectData(prospects);
        return this.setData(data);
      };
      return tableView;
    };
    UI.prototype.createProspectViewWindow = function(prospect) {
      var addressLabel, addressRow, addressSection, contact, contactLabel, contactSection, contacts, data, editButton, emailLabel, emailRow, emailSection, firstContactLabel, firstContactRow, firstContactSection, headerView, nameLabel, nextStepLabel, noneRow, phoneHomeLabel, phoneHomeRow, phoneMobileLabel, phoneMobileRow, phoneSection, recordContactButton, row, rowLabel, self, statusLabel, statusRow, statusSection, statusValueLabel, tableView, win, _i, _len;
      prospect = shl.Prospect.find(prospect.id);
      win = Ti.UI.createWindow();
      self = this;
      data = [];
      if (this.platform === 'iPhone OS') {
        editButton = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.EDIT
        });
        editButton.addEventListener('click', function(e) {
          var editWin;
          editWin = self.createProspectFormWin(prospect);
          editWin.addEventListener('close', function(e) {
            if (e.source.exitValue) {
              prospect = shl.Prospect.find(prospect.id);
              nameLabel.text = prospect.formatName();
              contactLabel.text = 'Last Contact: ' + prospect.formatContactPretty();
              if (typeof addressSection !== "undefined" && addressSection !== null) {
                addressLabel.text = prospect.formatAddress();
              }
              if (typeof phoneHomeLabel !== "undefined" && phoneHomeLabel !== null) {
                phoneHomeLabel.text = 'home: ' + prospect.phoneHome;
              }
              if (typeof phoneMobileLabel !== "undefined" && phoneMobileLabel !== null) {
                phoneMobileLabel.text = 'mobile: ' + prospect.phoneMobile;
              }
              if (typeof emailLabel !== "undefined" && emailLabel !== null) {
                emailLabel.text = prospect.email;
              }
              firstContactLabel.text = 'First Contact: ' + date('n/j/Y', prospect.firstContactDate) + "\n" + prospect.firstContactPoint;
              return statusValueLabel.text = prospect.status;
            } else if (this.deleteProspect) {
              return win.close();
            }
          });
          return editWin.open({
            modal: true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
          });
        });
        win.setRightNavButton(editButton);
      }
      headerView = Ti.UI.createView({
        height: '100'
      });
      nameLabel = Ti.UI.createLabel({
        text: prospect.formatName(),
        left: 10,
        top: 7,
        width: 300,
        height: 17,
        color: '#4c596e'
      });
      contactLabel = Ti.UI.createLabel({
        text: 'Last Contact: ' + prospect.formatContactPretty(),
        left: 10,
        top: 21,
        width: 300,
        height: 17,
        font: {
          fontSize: 12
        },
        color: '#4c596e'
      });
      nextStepLabel = Ti.UI.createLabel({
        text: 'Next Step: ' + prospect.nextStep,
        left: 10,
        top: 35,
        width: 300,
        height: 17,
        font: {
          fontSize: 12
        },
        color: '#4c596e'
      });
      recordContactButton = Ti.UI.createButton({
        width: 300,
        height: 57,
        top: 54,
        left: 10,
        title: 'Record Contact',
        color: '#fff',
        backgroundImage: '/images/button_blue.png'
      });
      recordContactButton.addEventListener('click', function(e) {
        var closeButton, commentRow, commentSection, commentsRow, commentsTextArea, contactTableView, dateField, dateRow, dateSection, decisionSection, emailRow, letterRow, phoneRow, recordContactNav, recordContactRoot, recordContactWin, recordDecisionRow, saveButton, tdata, today, visitRow, visitSection, visitedChurchRow;
        recordContactWin = Ti.UI.createWindow({
          backgroundColor: '#ffffff',
          navBarHidden: true
        });
        recordContactRoot = Ti.UI.createWindow({
          title: 'Record Contact'
        });
        if (self.platform === 'iPhone OS') {
          closeButton = Ti.UI.createButton({
            systemButton: Ti.UI.iPhone.SystemButton.CANCEL
          });
          closeButton.addEventListener('click', function(e) {
            return recordContactWin.close();
          });
          recordContactRoot.setLeftNavButton(closeButton);
          saveButton = Ti.UI.createButton({
            systemButton: Ti.UI.iPhone.SystemButton.SAVE
          });
          saveButton.addEventListener('click', function(e) {
            var commentsValue, createdContacts, dateValue, groupHasCheck, i, re, row, typeValue, _len, _len2, _ref, _ref2;
            re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if (dateField.value !== '' && !dateField.value.match(re)) {
              alert('Invalid date format. Please format date MM/DD/YYYY');
              return false;
            }
            if (dateField.value === '') {
              dateValue = 0;
            } else {
              dateValue = strtotime(dateField.value);
            }
            groupHasCheck = false;
            _ref = visitSection.rows;
            for (i = 0, _len = _ref.length; i < _len; i++) {
              row = _ref[i];
              if (visitSection.rows[i].hasCheck) {
                typeValue = visitSection.rows[i].title;
                groupHasCheck = true;
              }
            }
            if (groupHasCheck === false) {
              alert('You must select the type of visit.');
              return false;
            }
            commentsValue = commentsTextArea.value;
            createdContacts = [];
            createdContacts.push(prospect.createContact({
              type: typeValue,
              date: dateValue,
              comments: commentsValue
            }));
            if (decisionSection.rows.length > 1) {
              _ref2 = decisionSection.rows;
              for (i = 0, _len2 = _ref2.length; i < _len2; i++) {
                row = _ref2[i];
                if (!decisionSection.rows[i].hasChild) {
                  createdContacts.push(prospect.createContact({
                    type: decisionSection.rows[i].decisionType,
                    date: dateValue,
                    individual: decisionSection.rows[i].decisionPerson
                  }));
                }
              }
            }
            Ti.API.info(prospect.getContactList().toJSON());
            contactSection.addContactRows(createdContacts);
            return recordContactWin.close();
          });
          recordContactRoot.setRightNavButton(saveButton);
        }
        recordContactNav = Ti.UI.iPhone.createNavigationGroup({
          window: recordContactRoot
        });
        tdata = [];
        today = new Date();
        dateSection = Ti.UI.createTableViewSection({
          headerTitle: prospect.formatName()
        });
        dateRow = Ti.UI.createTableViewRow();
        dateField = Ti.UI.createTextField({
          height: 35,
          width: 300,
          left: 7,
          value: (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear(),
          keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
          returnKeyType: Titanium.UI.RETURNKEY_DONE,
          borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE
        });
        dateRow.add(dateField);
        dateSection.add(dateRow);
        tdata.push(dateSection);
        visitSection = Ti.UI.createTableViewSection({
          headerTitle: 'Type of Contact'
        });
        visitRow = Ti.UI.createTableViewRow({
          title: 'Visit',
          hasCheck: false
        });
        letterRow = Ti.UI.createTableViewRow({
          title: 'Letter',
          hasCheck: false
        });
        visitedChurchRow = Ti.UI.createTableViewRow({
          title: 'Visited Church',
          hasCheck: false
        });
        phoneRow = Ti.UI.createTableViewRow({
          title: 'Phone Call',
          hasCheck: false
        });
        emailRow = Ti.UI.createTableViewRow({
          title: 'Email',
          hasCheck: false
        });
        commentRow = Ti.UI.createTableViewRow({
          title: 'Comment',
          hasCheck: false
        });
        visitSection.add(visitRow);
        visitSection.add(letterRow);
        visitSection.add(visitedChurchRow);
        visitSection.add(phoneRow);
        visitSection.add(emailRow);
        visitSection.add(commentRow);
        visitSection.addEventListener('click', function(e) {
          var i, row, _len, _ref, _results;
          _ref = visitSection.rows;
          _results = [];
          for (i = 0, _len = _ref.length; i < _len; i++) {
            row = _ref[i];
            _results.push(i === (e.index - 1) ? visitSection.rows[i].hasCheck = true : visitSection.rows[i].hasCheck = false);
          }
          return _results;
        });
        tdata.push(visitSection);
        commentSection = Ti.UI.createTableViewSection({
          headerTitle: 'Comments'
        });
        commentsRow = Ti.UI.createTableViewRow({
          height: 100
        });
        commentsTextArea = Ti.UI.createTextArea({
          width: 280,
          height: 75,
          left: 7,
          keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
          returnKeyType: Titanium.UI.RETURNKEY_DONE,
          borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE
        });
        commentsRow.add(commentsTextArea);
        commentSection.add(commentsRow);
        tdata.push(commentSection);
        decisionSection = Ti.UI.createTableViewSection();
        recordDecisionRow = Ti.UI.createTableViewRow({
          title: 'Record Decision',
          hasChild: true
        });
        recordDecisionRow.addEventListener('click', function(e) {
          var baptizedRow, decisionMakerSection, femaleRow, footerView, joinedRow, maleRow, otherRow, otherTextField, recordDecisionWin, rowIndex, savedRow, typeData, typeDecisionSection, typeDecisionTableView;
          rowIndex = e.index;
          recordDecisionWin = Ti.UI.createWindow({
            title: 'Record Decision',
            backgroundColor: '#ffffff'
          });
          typeData = [];
          typeDecisionSection = Ti.UI.createTableViewSection({
            headerTitle: prospect.formatName()
          });
          savedRow = Ti.UI.createTableViewRow({
            title: 'Saved',
            hasCheck: false
          });
          baptizedRow = Ti.UI.createTableViewRow({
            title: 'Baptized',
            hasCheck: false
          });
          joinedRow = Ti.UI.createTableViewRow({
            title: 'Joined the Church',
            hasCheck: false
          });
          typeDecisionSection.add(savedRow);
          typeDecisionSection.add(baptizedRow);
          typeDecisionSection.add(joinedRow);
          typeDecisionSection.addEventListener('click', function(e) {
            var i, row, _len, _ref, _results;
            _ref = typeDecisionSection.rows;
            _results = [];
            for (i = 0, _len = _ref.length; i < _len; i++) {
              row = _ref[i];
              _results.push(i === e.index ? typeDecisionSection.rows[i].hasCheck = true : typeDecisionSection.rows[i].hasCheck = false);
            }
            return _results;
          });
          typeData.push(typeDecisionSection);
          decisionMakerSection = Ti.UI.createTableViewSection();
          if (prospect.firstMale !== '') {
            maleRow = Ti.UI.createTableViewRow({
              title: prospect.firstMale,
              hasCheck: false
            });
            decisionMakerSection.add(maleRow);
          }
          if (prospect.firstFemale !== '') {
            femaleRow = Ti.UI.createTableViewRow({
              title: prospect.firstFemale,
              hasCheck: false
            });
            decisionMakerSection.add(femaleRow);
          }
          otherRow = Ti.UI.createTableViewRow({
            hasCheck: false
          });
          otherTextField = Ti.UI.createTextField({
            height: 35,
            width: 270,
            left: 7,
            keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
            returnKeyType: Titanium.UI.RETURNKEY_DONE,
            borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
            hintText: 'Other Family Member'
          });
          otherTextField.addEventListener('blur', function(e) {
            if (maleRow != null) {
              maleRow.hasCheck = false;
            }
            if (femaleRow != null) {
              femaleRow.hasCheck = false;
            }
            return otherRow.hasCheck = true;
          });
          otherRow.add(otherTextField);
          decisionMakerSection.add(otherRow);
          decisionMakerSection.addEventListener('click', function(e) {
            var i, row, _len, _ref, _results;
            _ref = decisionMakerSection.rows;
            _results = [];
            for (i = 0, _len = _ref.length; i < _len; i++) {
              row = _ref[i];
              _results.push(i === (e.index - 3) ? (decisionMakerSection.rows[i].hasCheck = true, otherRow.hasCheck = false) : decisionMakerSection.rows[i].hasCheck = false);
            }
            return _results;
          });
          typeData.push(decisionMakerSection);
          footerView = Ti.UI.createView({
            height: 50,
            width: 300,
            left: 0
          });
          saveButton = Ti.UI.createButton({
            title: 'Save',
            backgroundImage: 'images/button_blue.png',
            width: 300,
            height: 50
          });
          saveButton.addEventListener('click', function(e) {
            var decisionPerson, decisionTitle, decisionType, groupHasCheck, i, newDecisionRow, row, _len, _len2, _ref, _ref2;
            decisionTitle = '';
            decisionType = '';
            decisionPerson = '';
            groupHasCheck = false;
            _ref = typeDecisionSection.rows;
            for (i = 0, _len = _ref.length; i < _len; i++) {
              row = _ref[i];
              if (typeDecisionSection.rows[i].hasCheck === true) {
                decisionType = typeDecisionSection.rows[i].title;
                decisionTitle += typeDecisionSection.rows[i].title + ' - ';
                groupHasCheck = true;
              }
            }
            if (groupHasCheck === false) {
              alert('You must choose the type of decision.');
              return false;
            }
            groupHasCheck = false;
            _ref2 = decisionMakerSection.rows;
            for (i = 0, _len2 = _ref2.length; i < _len2; i++) {
              row = _ref2[i];
              if (decisionMakerSection.rows[i].hasCheck === true) {
                if ((decisionMakerSection.rows[i].title != null) && decisionMakerSection.rows[i].title !== '') {
                  decisionPerson = decisionMakerSection.rows[i].title;
                  decisionTitle += decisionMakerSection.rows[i].title;
                } else {
                  decisionPerson = otherTextField.value;
                  decisionTitle += otherTextField.value;
                }
                groupHasCheck = true;
              }
            }
            if (groupHasCheck === false) {
              alert('You must choose the person who made the decision.');
              return false;
            }
            newDecisionRow = Ti.UI.createTableViewRow({
              title: decisionTitle,
              decisionType: decisionType,
              decisionPerson: decisionPerson,
              editable: true
            });
            contactTableView.insertRowBefore(rowIndex, newDecisionRow);
            return recordContactNav.close(recordDecisionWin);
          });
          footerView.add(saveButton);
          typeDecisionTableView = Ti.UI.createTableView({
            data: typeData,
            style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
            footerView: footerView
          });
          recordDecisionWin.add(typeDecisionTableView);
          return recordContactNav.open(recordDecisionWin);
        });
        decisionSection.add(recordDecisionRow);
        tdata.push(decisionSection);
        contactTableView = Ti.UI.createTableView({
          data: tdata,
          style: Titanium.UI.iPhone.TableViewStyle.GROUPED
        });
        recordContactRoot.add(contactTableView);
        recordContactWin.add(recordContactNav);
        return recordContactWin.open({
          modal: true,
          modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
          modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        });
      });
      headerView.add(nameLabel);
      headerView.add(contactLabel);
      headerView.add(nextStepLabel);
      headerView.add(recordContactButton);
      if (prospect.formatAddress() !== '') {
        addressSection = Ti.UI.createTableViewSection();
        addressRow = Ti.UI.createTableViewRow({
          height: 75
        });
        addressLabel = Ti.UI.createLabel({
          text: prospect.formatAddress(),
          left: 10
        });
        addressRow.add(addressLabel);
        addressSection.add(addressRow);
        addressSection.addEventListener('click', function(e) {
          var query;
          query = prospect.formatAddressGoogle();
          query = query.replace(/[ ]/gi, "+");
          Ti.API.info(query);
          return Ti.Platform.openURL("http://maps.google.com/maps?q=" + query);
        });
        data.push(addressSection);
      }
      if (prospect.phoneHome !== '' && prospect.phoneMobile !== '') {
        phoneSection = Ti.UI.createTableViewSection();
        if (prospect.phoneHome !== '') {
          phoneHomeRow = Ti.UI.createTableViewRow();
          phoneHomeLabel = Ti.UI.createLabel({
            text: 'home: ' + prospect.phoneHome,
            phone: prospect.phoneHome,
            left: 10
          });
          phoneHomeRow.add(phoneHomeLabel);
          phoneSection.add(phoneHomeRow);
        }
        if (prospect.phoneMobile !== '') {
          phoneMobileRow = Ti.UI.createTableViewRow();
          phoneMobileLabel = Ti.UI.createLabel({
            text: 'mobile: ' + prospect.phoneMobile,
            phone: prospect.phoneMobile,
            left: 10
          });
          phoneMobileRow.add(phoneMobileLabel);
          phoneSection.add(phoneMobileRow);
        }
        phoneSection.addEventListener('click', function(e) {
          return Ti.Platform.openURL('tel:' + e.source.phone);
        });
        data.push(phoneSection);
      }
      if (prospect.email !== '') {
        emailSection = Ti.UI.createTableViewSection();
        emailRow = Ti.UI.createTableViewRow();
        emailLabel = Ti.UI.createLabel({
          text: prospect.email,
          left: 10
        });
        emailRow.add(emailLabel);
        emailSection.add(emailRow);
        emailSection.addEventListener('click', function(e) {
          var emailDialog;
          emailDialog = Ti.UI.createEmailDialog();
          emailDialog.toRecipients = [e.source.text];
          return emailDialog.open();
        });
        data.push(emailSection);
      }
      firstContactSection = Ti.UI.createTableViewSection();
      firstContactRow = Ti.UI.createTableViewRow({
        height: 55
      });
      firstContactLabel = Ti.UI.createLabel({
        text: 'First Contact: ' + date('n/j/Y', prospect.firstContactDate) + "\n" + prospect.firstContactPoint,
        left: 10
      });
      firstContactRow.add(firstContactLabel);
      firstContactSection.add(firstContactRow);
      data.push(firstContactSection);
      statusSection = Ti.UI.createTableViewSection();
      statusRow = Ti.UI.createTableViewRow({
        hasChild: true
      });
      statusLabel = Ti.UI.createLabel({
        text: 'Status',
        left: 10
      });
      statusValueLabel = Ti.UI.createLabel({
        text: prospect.status,
        width: 'auto',
        height: 'auto',
        right: 5,
        color: '#395587',
        font: {
          fontSize: 12
        }
      });
      statusRow.addEventListener('click', function(e) {
        var statusTableView, statusWin;
        statusWin = Ti.UI.createWindow({
          title: 'Status'
        });
        statusTableView = Ti.UI.createTableView({
          data: [
            {
              title: 'Active Prospect',
              hasCheck: prospect.status === 'Active Prospect' ? true : false
            }, {
              title: 'Inactive Prospect',
              hasCheck: prospect.status === 'Inactive Prospect' ? true : false
            }, {
              title: 'Member',
              hasCheck: prospect.status === 'Member' ? true : false
            }, {
              title: 'Dead End',
              hasCheck: prospect.status === 'Dead End' ? true : false
            }
          ],
          style: Titanium.UI.iPhone.TableViewStyle.GROUPED
        });
        statusTableView.addEventListener('click', function(e) {
          var i, row, _len, _ref, _results;
          Ti.API.info(JSON.stringify(e.rowData));
          _ref = statusTableView.data[0].rows;
          _results = [];
          for (i = 0, _len = _ref.length; i < _len; i++) {
            row = _ref[i];
            Ti.API.info(JSON.stringify(row));
            _results.push(i === e.index ? statusTableView.data[0].rows[i].hasCheck = true : statusTableView.data[0].rows[i].hasCheck = false);
          }
          return _results;
        });
        statusWin.add(statusTableView);
        statusWin.addEventListener('close', function(e) {
          var i, row, _len, _ref, _results;
          _ref = statusTableView.data[0].rows;
          _results = [];
          for (i = 0, _len = _ref.length; i < _len; i++) {
            row = _ref[i];
            _results.push(row.hasCheck ? (prospect.updateAttribute('status', row.title), statusValueLabel.text = row.title) : void 0);
          }
          return _results;
        });
        return self.tabs.activeTab.open(statusWin);
      });
      statusRow.add(statusLabel);
      statusRow.add(statusValueLabel);
      statusSection.add(statusRow);
      data.push(statusSection);
      contacts = prospect.getContactList();
      contactSection = Ti.UI.createTableViewSection({
        headerTitle: 'Activity Log'
      });
      if (contacts.length < 1) {
        noneRow = Ti.UI.createTableViewRow({
          title: 'None',
          name: 'None'
        });
        contactSection.add(noneRow);
      } else {
        for (_i = 0, _len = contacts.length; _i < _len; _i++) {
          contact = contacts[_i];
          row = Ti.UI.createTableViewRow({
            height: 'auto'
          });
          rowLabel = Ti.UI.createLabel({
            text: date('n/j/Y', contact.date) + " " + contact.type + ": " + contact.comments,
            width: 280,
            left: 10
          });
          row.add(rowLabel);
          contactSection.add(row);
        }
      }
      contactSection.addContactRows = function(contacts) {
        var contact, _j, _len2;
        Ti.API.info("Contacts = " + JSON.stringify(contacts));
        for (_j = 0, _len2 = contacts.length; _j < _len2; _j++) {
          contact = contacts[_j];
          row = Ti.UI.createTableViewRow({
            height: 'auto'
          });
          rowLabel = Ti.UI.createLabel({
            text: date('n/j/Y', contact.date) + " " + contact.type + ": " + contact.comments,
            width: 280,
            left: 10
          });
          row.add(rowLabel);
          tableView.appendRow(row);
        }
        return tableView.deleteRow(tableView.getIndexByName('None'));
      };
      data.push(contactSection);
      tableView = Ti.UI.createTableView({
        data: data,
        headerView: headerView,
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      });
      win.add(tableView);
      return win;
    };
    UI.prototype.processListData = function(lists) {
      var addCustom, data, i, row, viewMore;
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
      viewMore = Ti.UI.createTableViewRow({
        height: 'auto',
        title: 'View All Lists',
        listID: 'more',
        editable: false,
        moveable: false,
        name: 'more'
      });
      data.push(viewMore);
      return data;
    };
    UI.prototype.processProspectData = function(prospects) {
      var addressLabel, content, contentTitle, data, lastContactLabel, prospect, row, starImage;
      if (prospects.length < 1) {
        row = Ti.UI.createTableViewRow();
        return [row];
      }
      return data = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = prospects.length; _i < _len; _i++) {
          prospect = prospects[_i];
          row = Ti.UI.createTableViewRow({
            height: 'auto',
            hasChild: true,
            selectedBackgroundColor: '#ffffff'
          });
          content = Ti.UI.createView({
            height: 'auto',
            layout: 'vertical',
            left: 25,
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
          /*
                if prospect.nextStep is 'Salvation'
                  nextstepColor = '#ae2a2a'
                else if prospect.nextStep is 'Baptism'
                  nextstepColor = '#22678f'
                else if prospect.nextStep is 'Attendance'
                  nextstepColor = '#cba81a'
                else if prospect.nextStep is 'Membership'
                  nextstepColor = '#608f22'
                nextstepLabel = Ti.UI.createLabel({
                  text: "  " + prospect.nextStep + "  ",
                  font: {fontWeight: 'normal', fontSize: 8},
                  backgroundColor: nextstepColor,
                  backgroundSelectedColor: nextstepColor,
                  color: '#ffffff'
                  borderRadius: 5,
                  backgroundPaddingLeft: 5,
                  backgroundPaddingRight: 5,
                  height: 15,
                  width: 43,
                  right: 5,
                  top: 5
                })
                */
          starImage = Ti.UI.createImageView({
            url: prospect.isStarred() ? 'images/star-on.png' : 'images/star-off.png',
            width: 30,
            height: 30,
            left: 0,
            top: 5,
            prospectID: prospect.id
          });
          starImage.addEventListener('click', function(e) {
            var starList, z;
            if (this.url === 'images/star-off.png') {
              this.url = 'images/star-on.png';
              starList = shl.List.find(1);
              return starList.createListing({
                prospect_id: this.prospectID
              });
            } else {
              this.url = 'images/star-off.png';
              z = shl.Listing.find({
                first: true,
                where: {
                  list_id: 1,
                  prospect_id: this.prospectID
                }
              });
              return z.destroy();
            }
          });
          row.add(starImage);
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
    UI.prototype.createProspectFormWin = function(prospect) {
      var attendedRow, b, cancel, city, citystateRow, country, data, deleteProspectButton, deleteProspectView, email, emailRow, enrolledRow, fname, fnameRow, homeLabel, homeRow, homeText, initContactLabel, initialContactRow, initialPicker, lname, lnameRow, mobileLabel, mobileRow, mobileText, pocRow, pocTextfield, prevBaptRow, prevSavedRow, s1, s3, s4, s5, s6, s7, self, sep1, sep2, sep3, sep4, sep5, sname, snameRow, state, street, streetRow, tableView, win, zip, zipcountryRow;
      self = this;
      win = Ti.UI.createWindow({
        title: prospect != null ? 'Edit Prospect' : 'Add Prospect',
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
        hintText: L('First Name Male'),
        value: prospect != null ? prospect.firstMale : ''
      });
      fnameRow.add(fname);
      s1.add(fnameRow);
      snameRow = Ti.UI.createTableViewRow({
        height: 40,
        layout: "vertical",
        selectionStyle: "none"
      });
      sname = Ti.UI.createTextField({
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('First Name Female'),
        value: prospect != null ? prospect.firstFemale : ''
      });
      snameRow.add(sname);
      s1.add(snameRow);
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
        hintText: L('Last Name'),
        value: prospect != null ? prospect.last : ''
      });
      lnameRow.add(lname);
      s1.add(lnameRow);
      data.push(s1);
      /*
          s2 = Ti.UI.createTableViewSection({
            borderColor: 'transparent',
            borderWidth: 0
          })
          genderRow = Ti.UI.createTableViewRow({
            backgroundColor: 'transparent',
            borderWidth: 0,
            borderColor: 'transparent',
            height: 40,
            selectionStyle: "none"
          })
          if @platform is 'iPhone OS'
            gender = Titanium.UI.createTabbedBar({
              labels: ['Male', 'Female', 'Couple'],
              backgroundColor: '#336699',
              style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
              height: 45,
              width: 302
            })
            # TODO : Create function to add/remove rows on click
            genderRow.addEventListener('click', (e) ->
              alert(@index)
            )
            genderRow.add(gender)
          s2.add(genderRow)
          data.push(s2)
          */
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
        hintText: L('Street'),
        value: prospect != null ? prospect.street : ''
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
        hintText: L('City'),
        value: prospect != null ? prospect.city : ''
      });
      sep1 = Ti.UI.createTextField({
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
        hintText: L('State'),
        value: prospect != null ? prospect.state : ''
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
        hintText: L('Zip'),
        value: prospect != null ? prospect.zip : ''
      });
      sep2 = Ti.UI.createTextField({
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
        hintText: L('Country'),
        value: prospect != null ? prospect.country : ''
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
        keyboardType: Titanium.UI.KEYBOARD_PHONE_PAD,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        value: prospect != null ? prospect.phoneHome : ''
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
        keyboardType: Titanium.UI.KEYBOARD_PHONE_PAD,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        value: prospect != null ? prospect.phoneMobile : ''
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
        keyboardType: Titanium.UI.KEYBOARD_EMAIL,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: L('Email'),
        value: prospect != null ? prospect.email : ''
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
        hintText: L('1/10/2011'),
        value: prospect != null ? date('n/j/Y', prospect.firstContactDate) : date('n/j/Y')
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
        hintText: L('Point of Contact'),
        value: prospect != null ? prospect.firstContactPoint : ''
      });
      pocRow.add(pocTextfield);
      s6.add(pocRow);
      data.push(s6);
      s7 = Ti.UI.createTableViewSection();
      prevSavedRow = Ti.UI.createTableViewRow({
        title: 'Previously Saved',
        hasCheck: prospect != null ? prospect.previouslySaved : false
      });
      prevBaptRow = Ti.UI.createTableViewRow({
        title: 'Previously Baptized',
        hasCheck: prospect != null ? prospect.previouslyBaptized : false
      });
      attendedRow = Ti.UI.createTableViewRow({
        title: 'Attended Church',
        hasCheck: prospect != null ? prospect.attended : false
      });
      enrolledRow = Ti.UI.createTableViewRow({
        title: 'Enrolled in Sunday School',
        hasCheck: prospect != null ? prospect.sundaySchool : false
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
          var closeButton, createdProspect, datePattern, emailPattern, viewProspectWin;
          emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (email.value !== '' && !email.value.match(emailPattern)) {
            alert('Invalid email address.');
            return false;
          }
          datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          if (initialPicker.value !== '' && !initialPicker.value.match(datePattern)) {
            alert('Invalid date format. Please format date MM/DD/YYYY');
            return false;
          }
          if (prospect != null) {
            shl.Prospect.update(prospect.id, {
              last: lname.value,
              firstMale: fname.value,
              firstFemale: sname.value,
              street: street.value,
              city: city.value,
              state: state.value,
              zip: zip.value,
              country: country.value,
              phoneHome: homeText.value,
              phoneMobile: mobileText.value,
              email: email.value,
              firstContactDate: strtotime(initialPicker.value),
              firstContactPoint: pocTextfield.value,
              previouslySaved: prevSavedRow.hasCheck,
              previouslyBaptized: prevBaptRow.hasCheck,
              attended: attendedRow.hasCheck,
              sundaySchool: enrolledRow.hasCheck
            });
            win.exitValue = true;
            return win.close();
          } else {
            createdProspect = shl.Prospect.create({
              last: lname.value,
              firstMale: fname.value,
              firstFemale: sname.value,
              street: street.value,
              city: city.value,
              state: state.value,
              zip: zip.value,
              country: country.value,
              phoneHome: homeText.value,
              phoneMobile: mobileText.value,
              email: email.value,
              firstContactDate: strtotime(initialPicker.value),
              firstContactPoint: pocTextfield.value,
              previouslySaved: prevSavedRow.hasCheck,
              previouslyBaptized: prevBaptRow.hasCheck,
              attended: attendedRow.hasCheck,
              sundaySchool: enrolledRow.hasCheck
            });
            Ti.API.info(createdProspect.toJSON());
            fname.value = '';
            sname.value = '';
            lname.value = '';
            street.value = '';
            city.value = '';
            state.value = '';
            zip.value = '';
            country.value = '';
            homeText.value = '';
            mobileText.value = '';
            email.value = '';
            initialPicker.value = date('n/j/Y');
            pocTextfield.value = '';
            prevSavedRow.hasCheck = false;
            prevBaptRow.hasCheck = false;
            attendedRow.hasCheck = false;
            enrolledRow.hasCheck = false;
            viewProspectWin = self.createProspectViewWindow(createdProspect);
            closeButton = Ti.UI.createButton({
              systemButton: Ti.UI.iPhone.SystemButton.DONE
            });
            closeButton.addEventListener('click', function(e) {
              return viewProspectWin.close();
            });
            viewProspectWin.setRightNavButton(closeButton);
            return self.tabs.activeTab.open(viewProspectWin);
          }
        });
        win.setRightNavButton(b);
        if (prospect != null) {
          cancel = Ti.UI.createButton({
            systemButton: Ti.UI.iPhone.SystemButton.CANCEL
          });
          cancel.addEventListener('click', function(e) {
            win.exitValue = false;
            return win.close();
          });
          win.setLeftNavButton(cancel);
        }
      }
      tableView = Ti.UI.createTableView({
        data: data,
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      });
      if (prospect != null) {
        deleteProspectView = Ti.UI.createView({
          width: 300,
          height: 57,
          layout: 'vertical'
        });
        deleteProspectButton = Ti.UI.createButton({
          width: 300,
          height: 57,
          left: 0,
          title: 'Delete',
          color: '#fff',
          font: {
            fontWeight: 'bold',
            fontSize: 22
          },
          backgroundImage: '/images/button_red.png'
        });
        deleteProspectButton.addEventListener('click', function(e) {
          var deleteProspectDialog, options;
          options = {
            options: ['Delete Prospect', 'Mark as Dead End', 'Cancel'],
            destructive: 0,
            cancel: 2,
            title: 'Are you really sure?'
          };
          deleteProspectDialog = Ti.UI.createOptionDialog(options);
          deleteProspectDialog.addEventListener('click', function(f) {
            if (f.index === 0) {
              prospect.destroy();
              win.deleteProspect = true;
              win.exitValue = false;
              return win.close();
            } else if (f.index === 1) {
              prospect.updateAttribute('status', 'Dead End');
              win.exitValue = true;
              return win.close();
            }
          });
          return deleteProspectDialog.show();
        });
        deleteProspectView.add(deleteProspectButton);
        tableView.footerView = deleteProspectView;
      }
      win.add(tableView);
      return win;
    };
    return UI;
  })();
  shl.ui = new UI;
}).call(this);
