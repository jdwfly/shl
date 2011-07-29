(function() {
  var ListsTab;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  ListsTab = (function() {
    function ListsTab() {
      this.win = this.createListsWindow();
      this.tab = Ti.UI.createTab({
        title: 'Lists',
        window: this.win,
        icon: 'images/179-notepad.png'
      });
    }
    ListsTab.prototype.createListsWindow = function() {
      var lists, self, tableView, win;
      self = this;
      win = Ti.UI.createWindow({
        title: 'Lists',
        activity: {
          onCreateOptionsMenu: function(e) {
            var m1, menu;
            menu = e.menu;
            m1 = menu.add({
              title: 'Add Prospect'
            });
            return m1.addEventListener('click', function(e) {
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
    ListsTab.prototype.createListTableView = function(lists) {
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
            if (lname.value !== '') {
              createdList = shl.List.create({
                name: lname.value,
                weight: 0,
                active: 1
              });
              return addW.close();
            } else {
              return alert('You must specify a name for the list.');
            }
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
            where: "name <> 'Starred'",
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
            data = shl.ui.processProspectData(prospects);
            return listview.setData(data);
          });
        });
        if (shl.aLists[e.row.title] != null) {
          listWin.title = e.row.title;
          query = shl.aLists[e.row.title].query;
          prospects = shl.Prospect.find(shl.aLists[e.row.title].query);
          Ti.API.info('prospects = ' + prospects.toJSON());
          listview = shl.ui.createProspectTableView(prospects);
          listWin.add(listview);
          return shl.ui.tabs.activeTab.open(listWin);
        } else {
          listWin.title = e.row.title;
          currentList = shl.List.find(e.row.listID);
          Ti.API.info('currentList = ' + currentList.toJSON());
          Ti.API.info('currentList = ' + JSON.stringify(ActiveRecord));
          prospects = currentList.getProspectList();
          Ti.API.info('prospects = ' + JSON.stringify(prospects));
          listview = shl.ui.createProspectTableView(prospects);
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
                  data = shl.ui.processProspectData(prospects);
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
          return shl.ui.tabs.activeTab.open(listWin);
        }
      });
      tableView.updateLists = function(lists) {
        data = self.processListData(lists);
        return this.setData(data);
      };
      return tableView;
    };
    ListsTab.prototype.createAddProspectsWindow = function(listId) {
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
    ListsTab.prototype.processListData = function(lists) {
      var addCustom, countView, currentList, data, i, listcount, listnameLabel, row, self, viewMore;
      self = this;
      data = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = lists.length; _i < _len; _i++) {
          i = lists[_i];
          row = Ti.UI.createTableViewRow({
            height: 45,
            hasChild: true,
            title: i.name,
            listID: i.id,
            editable: false,
            moveable: true
          });
          if (shl.ui.isAndroid) {
            listnameLabel = Ti.UI.createLabel({
              text: i.name,
              left: 0
            });
            row.add(listnameLabel);
          }
          if (shl.aLists[i.name] != null) {
            listcount = shl.Prospect.count(shl.aLists[i.name].query);
          } else {
            currentList = shl.List.find(i.id);
            listcount = currentList.getProspectCount();
          }
          countView = Ti.UI.createLabel({
            text: listcount.toFixed(),
            fontSize: 12,
            height: 21,
            width: 36,
            textAlign: 'center',
            right: 5,
            color: '#616161'
          });
          if (shl.ui.isAndroid) {
            countView.right = 15;
          }
          row.add(countView);
          _results.push(row);
        }
        return _results;
      })();
      addCustom = Ti.UI.createTableViewRow({
        height: 45,
        title: 'Create Custom List...',
        listID: 'custom',
        editable: false,
        moveable: false
      });
      data.push(addCustom);
      viewMore = Ti.UI.createTableViewRow({
        height: 45,
        title: 'View All Lists',
        listID: 'more',
        editable: false,
        moveable: false,
        name: 'more'
      });
      data.push(viewMore);
      return data;
    };
    return ListsTab;
  })();
  shl.listsTab = new ListsTab;
}).call(this);
