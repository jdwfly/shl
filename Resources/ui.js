(function() {
  var UI;
  UI = (function() {
    function UI() {
      this.isAndroid = Ti.Platform.name === 'android' ? true : false;
      this.platform = Ti.Platform.name;
    }
    UI.prototype.createApplicationTabGroup = function() {
      var addTab, listsTab, searchTab, starredTab, statsTab, tabs;
      tabs = Ti.UI.createTabGroup();
      listsTab = shl.listsTab.tab;
      starredTab = shl.starredTab.tab;
      addTab = shl.addTab.tab;
      searchTab = shl.searchTab.tab;
      statsTab = shl.statsTab.tab;
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
      tabs.addTab(statsTab);
      tabs.open({
        transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
      });
      this.tabs = tabs;
      return tabs;
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
      var data, editButton, self, tableView, win;
      prospect = shl.Prospect.find(prospect.id);
      win = Ti.UI.createWindow();
      self = this;
      data = this.processProspectViewData(prospect);
      tableView = Ti.UI.createTableView({
        data: data.data,
        headerView: data.headerView,
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      });
      tableView.updateProspect = function(prospect) {
        data = self.processProspectViewData(prospect);
        this.setData(data.data);
        return this.headerView = data.headerView;
      };
      if (this.platform === 'iPhone OS') {
        editButton = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.EDIT
        });
        editButton.addEventListener('click', function(e) {
          var editProspect, editWin;
          editProspect = shl.Prospect.find(prospect.id);
          editWin = self.createProspectFormWin(editProspect);
          editWin.addEventListener('close', function(e) {
            if (e.source.exitValue) {
              return tableView.updateProspect(prospect);
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
      win.addEventListener('open', function(e) {
        return win.addEventListener('focus', function(f) {
          var updateProspect;
          updateProspect = shl.Prospect.find(prospect.id);
          return tableView.updateProspect(updateProspect);
        });
      });
      win.add(tableView);
      return win;
    };
    UI.prototype.processProspectViewData = function(prospect) {
      var addressLabel, addressRow, addressSection, attendedRow, bogusNoneRow, bogusSection, contact, contactLabel, contactSection, contacts, data, decision, decisionList, decisionRow, emailLabel, emailRow, emailSection, essRow, firstContactLabel, firstContactRow, firstContactSection, headerView, nameLabel, nextStepLabel, noneRow, phoneHomeLabel, phoneHomeRow, phoneMobileLabel, phoneMobileRow, phoneSection, prevBaptRow, prevSavedRow, recordContactButton, row, rowLabel, self, statusLabel, statusRow, statusSection, statusValueLabel, _i, _j, _len, _len2;
      self = this;
      data = {};
      prospect = shl.Prospect.find(prospect.id);
      headerView = Ti.UI.createView({
        height: '116'
      });
      nameLabel = Ti.UI.createLabel({
        text: prospect.formatName(),
        left: 10,
        top: 7,
        width: 300,
        height: 24,
        color: '#4c596e',
        font: {
          fontSize: 20
        }
      });
      contactLabel = Ti.UI.createLabel({
        text: 'Last Contact: ' + prospect.formatContactPretty(),
        left: 10,
        top: 25,
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
        top: 39,
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
        top: 56,
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
            var commentsValue, createdContacts, dateValue, groupHasCheck, i, re, row, thisTime, typeValue, _len, _len2, _ref, _ref2;
            re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if (dateField.value !== '' && !dateField.value.match(re)) {
              alert('Invalid date format. Please format date MM/DD/YYYY');
              return false;
            }
            if (dateField.value === '') {
              dateValue = 0;
            } else {
              dateValue = strtotime(dateField.value);
              thisTime = new Date();
              dateValue = dateValue + (thisTime.getHours() * 3600) + (thisTime.getMinutes() * 60) + thisTime.getSeconds();
              Ti.API.info(dateValue);
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
          keyboardType: Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
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
      data.headerView = headerView;
      data.data = [];
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
        data.data.push(addressSection);
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
        data.data.push(phoneSection);
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
        data.data.push(emailSection);
      }
      bogusSection = Ti.UI.createTableViewSection({
        headerTitle: 'Decisions'
      });
      if (prospect.previouslySaved) {
        prevSavedRow = Ti.UI.createTableViewRow({
          title: 'Previously Saved'
        });
        bogusSection.add(prevSavedRow);
      }
      if (prospect.previouslyBaptized) {
        prevBaptRow = Ti.UI.createTableViewRow({
          title: 'Previously Baptized'
        });
        bogusSection.add(prevBaptRow);
      }
      if (prospect.attended) {
        attendedRow = Ti.UI.createTableViewRow({
          title: 'Attended Church'
        });
        bogusSection.add(attendedRow);
      }
      if (prospect.sundaySchool) {
        essRow = Ti.UI.createTableViewRow({
          title: 'Enrolled in Sunday School'
        });
        bogusSection.add(essRow);
      }
      decisionList = prospect.getContactList({
        where: 'prospect_id = ' + prospect.id + ' AND (type = "Saved" OR type="Baptized" OR type="Joined the Church")'
      });
      if (decisionList.length >= 1) {
        for (_i = 0, _len = decisionList.length; _i < _len; _i++) {
          decision = decisionList[_i];
          decisionRow = Ti.UI.createTableViewRow({
            title: decision.individual + " - " + decision.type + " " + date('n/j/Y', decision.date)
          });
          bogusSection.add(decisionRow);
        }
      }
      Ti.API.info(decisionList);
      if (!(bogusSection.rows != null)) {
        bogusNoneRow = Ti.UI.createTableViewRow({
          title: 'None',
          name: 'bogusNone'
        });
        bogusSection.add(bogusNoneRow);
      }
      /*
          bogusSection.updateRows = () ->
            bogusSection.rows = []
            if prevSavedRow? then bogusSection.add(prevSavedRow)
            if prevBaptRow? then bogusSection.add(prevBaptRow)
            if attendedRow? then bogusSection.add(attendedRow)
            if essRow? then bogusSection.add(essRow)
            decisionList = prospect.getContactList({
              where: 'prospect_id = '+prospect.id+' AND (type = "Saved" OR type="Baptized" OR type="Joined the Church")'
            })
            Ti.API.info(decisionList)
            if decisionList.length >= 1
              for decision in decisionList
                decisionRow = Ti.UI.createTableViewRow({
                  title: decision.individual + " - " + decision.type + " " + date('n/j/Y', decision.date)
                })
                bogusSection.add(decisionRow)
            if bogusSection.rows.length is 0
              bogusNoneRow = Ti.UI.createTableViewRow({title: 'None', name: 'bogusNone'})
              bogusSection.add(bogusNoneRow)
          */
      data.data.push(bogusSection);
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
      data.data.push(firstContactSection);
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
          var i, row, _len2, _ref, _results;
          Ti.API.info(JSON.stringify(e.rowData));
          _ref = statusTableView.data[0].rows;
          _results = [];
          for (i = 0, _len2 = _ref.length; i < _len2; i++) {
            row = _ref[i];
            Ti.API.info(JSON.stringify(row));
            _results.push(i === e.index ? (statusTableView.data[0].rows[i].hasCheck = true, prospect.updateAttribute('status', statusTableView.data[0].rows[i].title)) : statusTableView.data[0].rows[i].hasCheck = false);
          }
          return _results;
        });
        statusWin.add(statusTableView);
        return self.tabs.activeTab.open(statusWin);
      });
      statusRow.add(statusLabel);
      statusRow.add(statusValueLabel);
      statusSection.add(statusRow);
      data.data.push(statusSection);
      contacts = prospect.getContactList({
        order: 'date DESC'
      });
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
          contactSection.add(row);
        }
      }
      /*
          contactSection.addContactRows = (contacts) ->
            Ti.API.info("Contacts = " + JSON.stringify(contacts))
            # Loop through contacts and append rows
            for contact in contacts
              row = Ti.UI.createTableViewRow({
                height: 'auto'
              })
              rowLabel = Ti.UI.createLabel({
                text: date('n/j/Y', contact.date) + " " + contact.type + ": " + contact.comments,
                width: 280,
                left: 10
              })
              row.add(rowLabel)
              tableView.appendRow(row)
            if tableView.getIndexByName('None') isnt -1
              tableView.deleteRow(tableView.getIndexByName('None'))
          */
      data.data.push(contactSection);
      return data;
    };
    UI.prototype.processProspectData = function(prospects) {
      var addressLabel, content, contentTitle, data, lastContactLabel, prospect, row, starImage;
      if (prospects.length < 1) {
        row = Ti.UI.createTableViewRow({
          editable: false
        });
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
            selectedBackgroundColor: '#ffffff',
            searchTerm: prospect.formatName() + ' ' + prospect.formatAddress()
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
      var attendedRow, b, cancel, city, citystateRow, country, data, deleteProspectButton, deleteProspectView, email, emailRow, enrolledRow, fname, fnameRow, gender, genderView, homeLabel, homeRow, homeText, initContactLabel, initialContactRow, initialPicker, lname, lnameRow, mobileLabel, mobileRow, mobileText, nameSep, pocRow, pocTextfield, prevBaptRow, prevSavedRow, s1, s3, s4, s5, s6, s7, self, sep1, sep2, sep3, sep4, sep5, sname, state, street, streetRow, tableView, win, zip, zipcountryRow;
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
        width: 280,
        top: 0,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'First Name Male',
        value: prospect != null ? prospect.firstMale : ''
      });
      fnameRow.add(fname);
      nameSep = Ti.UI.createTextField({
        height: 1,
        backgroundColor: '#cccccc',
        visible: false,
        zindex: -10
      });
      fnameRow.add(nameSep);
      sname = Ti.UI.createTextField({
        height: 40,
        width: 280,
        top: -40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'First Name Female',
        value: prospect != null ? prospect.firstFemale : ''
      });
      fnameRow.add(sname);
      sname.hide();
      s1.add(fnameRow);
      lnameRow = Ti.UI.createTableViewRow({
        height: 40,
        layout: "vertical",
        selectionStyle: "none"
      });
      lname = Ti.UI.createTextField({
        height: 40,
        width: 280,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'Last Name',
        value: prospect != null ? prospect.last : ''
      });
      lnameRow.add(lname);
      s1.add(lnameRow);
      genderView = Ti.UI.createView({
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderColor: 'transparent',
        height: 50,
        selectionStyle: "none"
      });
      if (this.platform === 'iPhone OS') {
        gender = Titanium.UI.createTabbedBar({
          labels: ['Male', 'Female', 'Couple'],
          backgroundColor: '#336699',
          style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
          height: 45,
          top: 5,
          width: 302,
          index: 0
        });
        genderView.addEventListener('click', function(e) {
          if (this.index === 0) {
            nameSep.visible = false;
            fnameRow.height = 40;
            sname.top = -40;
            sname.animate({
              visible: false
            }, function() {
              return fname.animate({
                visible: true
              });
            });
            if (!fname.value) {
              fname.value = sname.value;
            }
            return sname.value = '';
          } else if (this.index === 1) {
            nameSep.visible = false;
            fnameRow.height = 40;
            fname.animate({
              visible: false
            }, function() {
              return sname.animate({
                visible: true
              });
            });
            sname.top = -40;
            if (!sname.value) {
              sname.value = fname.value;
            }
            return fname.value = '';
          } else {
            fnameRow.height = 80;
            fname.animate({
              visible: true
            }, function() {
              sname.animate({
                top: 0
              });
              return nameSep.visible = true;
            });
            return sname.animate({
              visible: true
            });
          }
        });
        genderView.add(gender);
      } else if (this.isAndroid) {
        fnameRow.height = 80;
        sname.top = 0;
      }
      if (fname.value !== '' && sname.value !== '') {
        fnameRow.height = 80;
        fname.animate({
          visible: true
        }, function() {
          sname.animate({
            top: 0
          });
          return nameSep.visible = true;
        });
        sname.animate({
          visible: true
        });
      } else if (sname.value !== '') {
        nameSep.visible = false;
        fnameRow.height = 40;
        fname.animate({
          visible: false
        }, function() {
          return sname.animate({
            visible: true
          });
        });
        sname.top = -40;
        if (!sname.value) {
          sname.value = fname.value;
        }
        fname.value = '';
      }
      s1.footerView = genderView;
      data.push(s1);
      s3 = Ti.UI.createTableViewSection();
      streetRow = Ti.UI.createTableViewRow({
        height: 45,
        layout: "vertical",
        selectionStyle: "none"
      });
      street = Ti.UI.createTextField({
        height: 40,
        width: 280,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'Street',
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
        hintText: 'City',
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
        hintText: 'State',
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
        keyboardType: Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'Zip',
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
        hintText: 'Country',
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
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        hintText: 'Email',
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
        height: 40,
        width: 120,
        left: 7,
        keyboardType: Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: '1/10/2011',
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
        hintText: 'Point of Contact',
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
        if (!self.isAndroid) {
          if (e.row.hasCheck) {
            return e.row.hasCheck = false;
          } else {
            return e.row.hasCheck = true;
          }
        }
      });
      if (this.isAndroid) {
        prevSavedRow.addEventListener('click', function(e) {
          if (e.row.hasCheck) {
            return e.row.hasCheck = false;
          } else {
            return e.row.hasCheck = true;
          }
        });
        prevBaptRow.addEventListener('click', function(e) {
          if (e.row.hasCheck) {
            return e.row.hasCheck = false;
          } else {
            return e.row.hasCheck = true;
          }
        });
        attendedRow.addEventListener('click', function(e) {
          if (e.row.hasCheck) {
            return e.row.hasCheck = false;
          } else {
            return e.row.hasCheck = true;
          }
        });
        enrolledRow.addEventListener('click', function(e) {
          if (e.row.hasCheck) {
            return e.row.hasCheck = false;
          } else {
            return e.row.hasCheck = true;
          }
        });
      }
      data.push(s7);
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
            previouslySaved: prevSavedRow.hasCheck ? "1" : "0",
            previouslyBaptized: prevBaptRow.hasCheck ? "1" : "0",
            attended: attendedRow.hasCheck ? "1" : "0",
            sundaySchool: enrolledRow.hasCheck ? "1" : "0"
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
            previouslySaved: prevSavedRow.hasCheck ? "1" : "0",
            previouslyBaptized: prevBaptRow.hasCheck ? "1" : "0",
            attended: attendedRow.hasCheck ? "1" : "0",
            sundaySchool: enrolledRow.hasCheck ? "1" : "0"
          });
          Ti.API.info(createdProspect.toJSON());
          fname.value = '';
          fname.blur();
          sname.value = '';
          sname.blur();
          lname.value = '';
          lname.blur();
          street.value = '';
          street.blur();
          city.value = '';
          city.blur();
          state.value = '';
          state.blur();
          zip.value = '';
          zip.blur();
          country.value = '';
          country.blur();
          homeText.value = '';
          homeText.blur();
          mobileText.value = '';
          mobileText.blur();
          email.value = '';
          email.blur();
          initialPicker.value = date('n/j/Y');
          initialPicker.blur();
          pocTextfield.value = '';
          pocTextfield.blur();
          tableView.scrollToTop(0);
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
          if (self.isAndroid) {
            Ti.API.info('todo');
          } else {
            viewProspectWin.setRightNavButton(closeButton);
          }
          return self.tabs.activeTab.open(viewProspectWin);
        }
      });
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
      tableView = Ti.UI.createTableView({
        data: data,
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      });
      if (this.isAndroid) {
        tableView.backgroundColor = '#181818';
        b.height = 40;
        b.width = 300;
        b.title = 'Save Prospect';
        tableView.footerView = b;
      } else {
        win.setRightNavButton(b);
      }
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
