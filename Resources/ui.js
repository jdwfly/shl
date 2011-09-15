(function() {
  var UI;
  UI = (function() {
    function UI() {
      this.isAndroid = Ti.Platform.name === 'android' ? true : false;
      this.platform = Ti.Platform.name;
    }
    UI.prototype.createApplicationTabGroup = function() {
      var addTab, listsTab, searchTab, settingsTab, starredTab, statsTab, tabs;
      tabs = Ti.UI.createTabGroup();
      listsTab = shl.listsTab.tab;
      starredTab = shl.starredTab.tab;
      addTab = shl.addTab.tab;
      searchTab = shl.searchTab.tab;
      statsTab = shl.statsTab.tab;
      settingsTab = shl.settingsTab.tab;
      /*
          nearbyTab = Ti.UI.createTab({
            title: 'Nearby',
            window: nearby,
            icon: 'images/73-radar.png'
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
      tabs.addTab(settingsTab);
      if (this.isAndroid) {
        tabs.addEventListener('focus', function(e) {
          Ti.API.info('Current Tab Index: ' + e.index);
          if (e.index === 0) {
            Ti.App.fireEvent('ListWinUpdate');
          }
          if (e.index === 2) {
            return Ti.App.fireEvent('AddFormUpdate');
          }
        });
      }
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
        if (self.isAndroid) {
          if (dataSourceString.indexOf('Ti.UI.ImageView') !== -1.0) {
            return true;
          }
        } else {
          if (dataSourceString.indexOf('TiUIImageView') !== -1) {
            return true;
          }
        }
        if (!tableView.editing) {
          Ti.API.info(JSON.stringify(e.row));
          if (!(e.row.prospect != null)) {
            return false;
          }
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
      var data, editButton, editButtonListener, self, tableView, win;
      prospect = shl.Prospect.find(prospect.id);
      win = Ti.UI.createWindow();
      self = this;
      data = this.processProspectViewData(prospect);
      tableView = Ti.UI.createTableView({
        data: data.data,
        headerView: data.headerView,
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      });
      tableView.addEventListener('delete', function(e) {
        var d;
        Ti.API.info(e.row.contactID);
        d = shl.Contact.find(e.row.contactID);
        return d.destroy();
      });
      tableView.updateProspect = function(prospect) {
        data = self.processProspectViewData(prospect);
        this.setData(data.data);
        return this.headerView = data.headerView;
      };
      editButtonListener = function(e) {
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
        if (self.isAndroid) {
          return self.tabs.activeTab.open(editWin);
        } else {
          return editWin.open({
            modal: true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
          });
        }
      };
      if (this.platform === 'iPhone OS') {
        editButton = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.EDIT
        });
        editButton.addEventListener('click', editButtonListener);
        win.setRightNavButton(editButton);
      }
      win.addEventListener('open', function(e) {
        return win.addEventListener('focus', function(f) {
          var updateProspect;
          updateProspect = shl.Prospect.find(prospect.id);
          return tableView.updateProspect(updateProspect);
        });
      });
      win.activity = {
        onCreateOptionsMenu: function(e) {
          var m1, menu;
          menu = e.menu;
          m1 = menu.add({
            title: 'Edit'
          });
          return m1.addEventListener('click', editButtonListener);
        }
      };
      win.add(tableView);
      return win;
    };
    UI.prototype.processProspectViewData = function(prospect) {
      var addressLabel, addressRow, addressSection, attendedRow, bogusNoneRow, bogusSection, contact, contactLabel, contactSection, contacts, data, decision, decisionList, decisionRow, emailLabel, emailRow, emailSection, essRow, firstContactLabel, firstContactRow, firstContactSection, headerView, nameLabel, nextStepLabel, noneRow, phoneHomeLabel, phoneHomeRow, phoneMobileLabel, phoneMobileRow, phoneSection, prevBaptRow, prevSavedRow, recordContactButton, row, rowLabel, self, statusLabel, statusRow, statusSection, statusValueLabel, _i, _j, _len, _len2;
      self = this;
      data = {};
      if (!(prospect.id != null)) {
        return {};
      }
      prospect = shl.Prospect.find(prospect.id);
      headerView = Ti.UI.createView({
        height: '116'
      });
      nameLabel = Ti.UI.createLabel({
        text: typeof prospect.formatName === "function" ? prospect.formatName() : void 0,
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
        text: 'Last Contact: ' + (typeof prospect.formatContactPretty === "function" ? prospect.formatContactPretty() : void 0),
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
      if (this.isAndroid) {
        nameLabel.color = '#bdbebd';
        contactLabel.color = '#bdbebd';
        contactLabel.top = 29;
        nextStepLabel.top = 43;
        nextStepLabel.color = '#bdbebd';
      }
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
        var closeButton, commentRow, commentSection, commentsRow, commentsTextArea, contactTableView, dateField, datePicker, datePickerView, dateRow, dateSection, decisionSection, emailRow, letterRow, phoneRow, pickerCancel, pickerDone, pickerSlideIn, pickerSlideOut, pickerSpacer, pickerToolbar, recordContactNav, recordContactRoot, recordContactWin, recordDecisionRow, saveButton, saveButtonListener, tdata, today, visitRow, visitSection, visitSectionListener, visitedChurchRow;
        recordContactWin = Ti.UI.createWindow({
          backgroundColor: '#ffffff',
          navBarHidden: true
        });
        recordContactRoot = Ti.UI.createWindow({
          title: 'Record Contact'
        });
        saveButtonListener = function(e) {
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
          if (self.isAndroid) {
            recordContactRoot.close();
          }
          return recordContactWin.close();
        };
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
          saveButton.addEventListener('click', saveButtonListener);
          recordContactRoot.setRightNavButton(saveButton);
          recordContactNav = Ti.UI.iPhone.createNavigationGroup({
            window: recordContactRoot
          });
        }
        tdata = [];
        today = new Date();
        dateSection = Ti.UI.createTableViewSection({
          headerTitle: typeof prospect.formatName === "function" ? prospect.formatName() : void 0
        });
        dateRow = Ti.UI.createTableViewRow();
        datePickerView = Ti.UI.createView({
          height: 251,
          bottom: -251
        });
        pickerCancel = Ti.UI.createButton({
          title: 'Cancel',
          style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
        });
        pickerDone = Ti.UI.createButton({
          title: 'Done',
          style: Ti.UI.iPhone.SystemButtonStyle.DONE
        });
        pickerSpacer = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });
        pickerToolbar = Ti.UI.createToolbar({
          top: 0,
          items: [pickerCancel, pickerSpacer, pickerDone]
        });
        today = new Date();
        datePicker = Ti.UI.createPicker({
          top: 43,
          type: Ti.UI.PICKER_TYPE_DATE,
          value: today
        });
        datePicker.selectionIndicator = true;
        datePicker.addEventListener('change', function(e) {
          return datePicker.value = e.value;
        });
        datePickerView.add(pickerToolbar);
        datePickerView.add(datePicker);
        dateField = Ti.UI.createTextField({
          height: 40,
          width: 300,
          left: 7,
          value: (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear(),
          borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE
        });
        pickerSlideIn = Ti.UI.createAnimation({
          bottom: 0
        });
        pickerSlideOut = Ti.UI.createAnimation({
          bottom: -251
        });
        dateField.addEventListener('focus', function() {
          datePickerView.animate(pickerSlideIn);
          return dateField.blur();
        });
        pickerCancel.addEventListener('click', function() {
          return datePickerView.animate(pickerSlideOut);
        });
        pickerDone.addEventListener('click', function() {
          dateField.value = date('n/j/Y', datePicker.value);
          return datePickerView.animate(pickerSlideOut);
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
        visitSectionListener = function(e) {
          var i, row, _len, _ref, _results;
          _ref = visitSection.rows;
          _results = [];
          for (i = 0, _len = _ref.length; i < _len; i++) {
            row = _ref[i];
            _results.push(i === (e.index - 1) ? visitSection.rows[i].hasCheck = true : visitSection.rows[i].hasCheck = false);
          }
          return _results;
        };
        if (self.isAndroid) {
          visitRow.addEventListener('click', visitSectionListener);
          letterRow.addEventListener('click', visitSectionListener);
          visitedChurchRow.addEventListener('click', visitSectionListener);
          phoneRow.addEventListener('click', visitSectionListener);
          emailRow.addEventListener('click', visitSectionListener);
          commentRow.addEventListener('click', visitSectionListener);
        }
        visitSection.add(visitRow);
        visitSection.add(letterRow);
        visitSection.add(visitedChurchRow);
        visitSection.add(phoneRow);
        visitSection.add(emailRow);
        visitSection.add(commentRow);
        visitSection.addEventListener('click', visitSectionListener);
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
          var baptizedRow, decisionMakerSection, decisionMakerSectionListener, femaleRow, footerView, joinedRow, maleRow, otherRow, otherTextField, recordDecisionWin, rowIndex, savedRow, typeData, typeDecisionSection, typeDecisionSectionListener, typeDecisionTableView;
          rowIndex = e.index;
          recordDecisionWin = Ti.UI.createWindow({
            title: 'Record Decision'
          });
          typeData = [];
          typeDecisionSection = Ti.UI.createTableViewSection();
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
          typeDecisionSectionListener = function(e) {
            var i, row, _len, _ref, _results;
            _ref = typeDecisionSection.rows;
            _results = [];
            for (i = 0, _len = _ref.length; i < _len; i++) {
              row = _ref[i];
              _results.push(i === e.index ? typeDecisionSection.rows[i].hasCheck = true : typeDecisionSection.rows[i].hasCheck = false);
            }
            return _results;
          };
          if (self.isAndroid) {
            savedRow.addEventListener('click', typeDecisionSectionListener);
            baptizedRow.addEventListener('click', typeDecisionSectionListener);
            joinedRow.addEventListener('click', typeDecisionSectionListener);
          }
          typeDecisionSection.add(savedRow);
          typeDecisionSection.add(baptizedRow);
          typeDecisionSection.add(joinedRow);
          typeDecisionSection.addEventListener('click', typeDecisionSectionListener);
          typeData.push(typeDecisionSection);
          decisionMakerSection = Ti.UI.createTableViewSection({
            headerTitle: 'Who made the decision?'
          });
          decisionMakerSectionListener = function(e) {
            var i, row, _len, _ref, _results;
            _ref = decisionMakerSection.rows;
            _results = [];
            for (i = 0, _len = _ref.length; i < _len; i++) {
              row = _ref[i];
              _results.push(i === (e.index - 3) ? (decisionMakerSection.rows[i].hasCheck = true, otherRow.hasCheck = false) : decisionMakerSection.rows[i].hasCheck = false);
            }
            return _results;
          };
          if (prospect.firstMale !== '') {
            maleRow = Ti.UI.createTableViewRow({
              title: prospect.firstMale,
              hasCheck: false
            });
            if (self.isAndroid) {
              maleRow.addEventListener('click', decisionMakerSectionListener);
            }
            decisionMakerSection.add(maleRow);
          }
          if (prospect.firstFemale !== '') {
            femaleRow = Ti.UI.createTableViewRow({
              title: prospect.firstFemale,
              hasCheck: false
            });
            if (self.isAndroid) {
              femaleRow.addEventListener('click', decisionMakerSectionListener);
            }
            decisionMakerSection.add(femaleRow);
          }
          otherRow = Ti.UI.createTableViewRow({
            hasCheck: false
          });
          otherTextField = Ti.UI.createTextField({
            height: 40,
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
          decisionMakerSection.addEventListener('click', decisionMakerSectionListener);
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
          saveButtonListener = function(e) {
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
            if (self.platform === 'iPhone OS') {
              return recordContactNav.close(recordDecisionWin);
            } else {
              return recordDecisionWin.close();
            }
          };
          saveButton.addEventListener('click', saveButtonListener);
          footerView.add(saveButton);
          typeDecisionTableView = Ti.UI.createTableView({
            data: typeData,
            style: Titanium.UI.iPhone.TableViewStyle.GROUPED
          });
          recordDecisionWin.add(typeDecisionTableView);
          recordDecisionWin.activity = {
            onCreateOptionsMenu: function(w) {
              var m1, m2, menu;
              menu = w.menu;
              m1 = menu.add({
                title: 'Save'
              });
              m1.addEventListener('click', saveButtonListener);
              m2 = menu.add({
                title: 'Cancel'
              });
              return m2.addEventListener('click', function(x) {
                return recordDecisionWin.close();
              });
            }
          };
          if (self.platform === 'iPhone OS') {
            typeDecisionTableView.footerView = footerView;
            return recordContactNav.open(recordDecisionWin);
          } else {
            return self.tabs.activeTab.open(recordDecisionWin);
          }
        });
        decisionSection.add(recordDecisionRow);
        tdata.push(decisionSection);
        contactTableView = Ti.UI.createTableView({
          data: tdata,
          style: Titanium.UI.iPhone.TableViewStyle.GROUPED
        });
        recordContactRoot.add(contactTableView);
        recordContactRoot.add(datePickerView);
        recordContactRoot.activity = {
          onCreateOptionsMenu: function(w) {
            var m1, m2, menu;
            menu = w.menu;
            m1 = menu.add({
              title: 'Save'
            });
            m1.addEventListener('click', saveButtonListener);
            m2 = menu.add({
              title: 'Cancel'
            });
            return m2.addEventListener('click', function(x) {
              return recordContactRoot.close();
            });
          }
        };
        if (self.platform === 'iPhone OS') {
          recordContactWin.add(recordContactNav);
          return recordContactWin.open({
            modal: true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
          });
        } else {
          return self.tabs.activeTab.open(recordContactRoot);
        }
      });
      headerView.add(nameLabel);
      headerView.add(contactLabel);
      headerView.add(nextStepLabel);
      headerView.add(recordContactButton);
      data.headerView = headerView;
      data.data = [];
      if ((typeof prospect.formatAddress === "function" ? prospect.formatAddress() : void 0) !== '') {
        addressSection = Ti.UI.createTableViewSection();
        addressRow = Ti.UI.createTableViewRow({
          height: 75
        });
        addressLabel = Ti.UI.createLabel({
          text: typeof prospect.formatAddress === "function" ? prospect.formatAddress() : void 0,
          left: 10
        });
        addressRow.add(addressLabel);
        addressSection.add(addressRow);
        addressSection.addEventListener('click', function(e) {
          var query;
          query = typeof prospect.formatAddressGoogle === "function" ? prospect.formatAddressGoogle() : void 0;
          query = query.replace(/[ ]/gi, "+");
          Ti.API.info(query);
          return Ti.Platform.openURL("http://maps.google.com/maps?q=" + query);
        });
        data.data.push(addressSection);
      }
      if (prospect.phoneHome !== '' || prospect.phoneMobile !== '') {
        phoneSection = Ti.UI.createTableViewSection();
        if (prospect.phoneHome !== '') {
          phoneHomeRow = Ti.UI.createTableViewRow();
          phoneHomeLabel = Ti.UI.createLabel({
            text: 'home: ' + formatPhone(prospect.phoneHome),
            phone: prospect.phoneHome,
            left: 10
          });
          phoneHomeRow.add(phoneHomeLabel);
          phoneSection.add(phoneHomeRow);
        }
        if (prospect.phoneMobile !== '') {
          phoneMobileRow = Ti.UI.createTableViewRow();
          phoneMobileLabel = Ti.UI.createLabel({
            text: 'mobile: ' + formatPhone(prospect.phoneMobile),
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
        right: this.isAndroid ? 30 : 5,
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
            height: 'auto',
            editable: 'true'
          });
          rowLabel = Ti.UI.createLabel({
            text: date('n/j/Y', contact.date) + " " + contact.type + ": " + contact.comments,
            width: 280,
            left: 10
          });
          row.contactID = contact.id;
          row.add(rowLabel);
          contactSection.add(row);
        }
      }
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
            searchTerm: (typeof prospect.formatName === "function" ? prospect.formatName() : void 0) + ' ' + (typeof prospect.formatAddress === "function" ? prospect.formatAddress() : void 0)
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
            text: typeof prospect.formatName === "function" ? prospect.formatName() : void 0,
            font: {
              fontWeight: 'bold',
              fontSize: 18
            },
            height: 'auto',
            width: 'auto',
            left: 5
          });
          lastContactLabel = Ti.UI.createLabel({
            text: 'Last Contact: ' + (typeof prospect.formatContactPretty === "function" ? prospect.formatContactPretty() : void 0),
            font: {
              fontWeight: 'normal',
              fontSize: 12
            },
            height: 'auto',
            width: 'auto',
            left: 5
          });
          addressLabel = Ti.UI.createLabel({
            text: typeof prospect.formatAddress === "function" ? prospect.formatAddress() : void 0,
            font: {
              fontWeight: 'normal',
              fontSize: 12
            },
            height: 'auto',
            width: 'auto',
            left: 5
          });
          starImage = Ti.UI.createImageView({
            backgroundImage: (typeof prospect.isStarred === "function" ? prospect.isStarred() : void 0) ? 'images/star-on.png' : 'images/star-off.png',
            width: 30,
            height: 30,
            left: 0,
            top: 5,
            prospectID: prospect.id
          });
          starImage.addEventListener('click', function(e) {
            var currentProspect, starList, z;
            currentProspect = shl.Prospect.find(starImage.prospectID);
            if (!(typeof currentProspect.isStarred === "function" ? currentProspect.isStarred() : void 0)) {
              this.backgroundImage = 'images/star-on.png';
              starList = shl.List.find(1);
              return starList.createListing({
                prospect_id: this.prospectID
              });
            } else {
              this.backgroundImage = 'images/star-off.png';
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
      var attendValue, attendedRow, b, cancel, city, citystateRow, country, data, deleteProspectButton, email, emailRow, enrolledRow, enrolledValue, fname, fnameRow, gender, genderValue, genderView, homeLabel, homeRow, homeText, initContactDate, initContactLabel, initPickerView, initialContactRow, initialPicker, lname, lnameRow, mobileLabel, mobileRow, mobileText, nameSep, pickerCancel, pickerDone, pickerSlideIn, pickerSlideOut, pickerSpacer, pickerToolbar, pocRow, pocTextfield, prevBaptRow, prevBaptValue, prevSavedRow, prevSavedValue, s1, s3, s4, s5, s6, s7, self, sep1, sep2, sep3, sep4, sep5, sname, state, street, streetRow, tableFooterView, tableView, today, win, zip, zipcountryRow;
      if (this.isAndroid) {
        return this.createProspectFormWinAndroid(prospect);
      }
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
        height: prospect != null ? 0 : 60,
        selectionStyle: "none"
      });
      if (this.platform === 'iPhone OS') {
        if (prospect != null) {
          if (sname.value !== '') {
            genderValue = 1;
          }
          if (fname.value !== '') {
            genderValue = 0;
          }
          if (sname.value !== '' && fname.value !== '') {
            genderValue = 2;
          }
        }
        gender = Titanium.UI.createTabbedBar({
          labels: ['Male', 'Female', 'Couple'],
          backgroundColor: '#336699',
          style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
          height: 45,
          top: 5,
          width: 302,
          index: prospect != null ? genderValue : 0
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
            sname.animate({
              visible: true
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
              nameSep.visible = true;
              return sname.top = 0;
            });
            sname.animate({
              visible: true
            });
            return sname.animate({
              top: 0
            });
          }
        });
        genderView.add(gender);
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
          sname.top = 0;
          nameSep.visible = true;
          sname.visible = true;
          sname.animate({
            visible: true
          });
        } else if (sname.value !== '') {
          nameSep.visible = false;
          fnameRow.height = 40;
          fname.visible = false;
          fname.animate({
            visible: false
          }, function() {
            return sname.animate({
              visible: true
            });
          });
          sname.visible = true;
          sname.top = -40;
          if (!sname.value) {
            sname.value = fname.value;
          }
          fname.value = '';
        }
      }
      if (this.isAndroid) {
        fnameRow.height = 80;
        sname.top = 0;
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
        value: prospect != null ? prospect.city : Ti.App.Properties.getString('defaultCity', '')
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
        value: prospect != null ? prospect.state : Ti.App.Properties.getString('defaultState', '')
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
        value: prospect != null ? prospect.zip : Ti.App.Properties.getString('defaultZip', '')
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
        value: prospect != null ? prospect.country : Ti.App.Properties.getString('defaultCountry', '')
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
      initPickerView = Ti.UI.createView({
        height: 251,
        bottom: -251
      });
      pickerCancel = Ti.UI.createButton({
        title: 'Cancel',
        style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
      });
      pickerDone = Ti.UI.createButton({
        title: 'Done',
        style: Ti.UI.iPhone.SystemButtonStyle.DONE
      });
      pickerSpacer = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
      });
      pickerToolbar = Ti.UI.createToolbar({
        top: 0,
        items: [pickerCancel, pickerSpacer, pickerDone]
      });
      today = new Date();
      initialPicker = Ti.UI.createPicker({
        top: 43,
        type: Ti.UI.PICKER_TYPE_DATE,
        value: prospect != null ? new Date(prospect.firstContactDate * 1000) : today
      });
      initialPicker.selectionIndicator = true;
      initialPicker.addEventListener('change', function(e) {
        return initialPicker.value = e.value;
      });
      initPickerView.add(pickerToolbar);
      initPickerView.add(initialPicker);
      initContactDate = Ti.UI.createTextField({
        hintText: '1/10/2011',
        value: prospect != null ? date('n/j/Y', prospect.firstContactDate) : date('n/j/Y'),
        height: 40,
        width: 120,
        left: 7,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
      });
      pickerSlideIn = Ti.UI.createAnimation({
        bottom: 0
      });
      pickerSlideOut = Ti.UI.createAnimation({
        bottom: -251
      });
      initContactDate.addEventListener('focus', function() {
        initPickerView.animate(pickerSlideIn);
        return initContactDate.blur();
      });
      pickerCancel.addEventListener('click', function() {
        return initPickerView.animate(pickerSlideOut);
      });
      pickerDone.addEventListener('click', function() {
        initContactDate.value = date('n/j/Y', initialPicker.value);
        return initPickerView.animate(pickerSlideOut);
      });
      initialContactRow.add(initContactLabel);
      initialContactRow.add(sep5);
      initialContactRow.add(initContactDate);
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
      if (prospect != null) {
        prevSavedValue = prospect.previouslySaved.toFixed() == 1 ? true : false;
        prevBaptValue = prospect.previouslyBaptized.toFixed() == 1 ? true : false;
        attendValue = prospect.attended.toFixed() == 1 ? true : false;
        enrolledValue = prospect.sundaySchool.toFixed() == 1 ? true : false;
      }
      prevSavedRow = Ti.UI.createTableViewRow({
        title: 'Previously Saved',
        hasCheck: prospect != null ? prevSavedValue : false
      });
      prevBaptRow = Ti.UI.createTableViewRow({
        title: 'Previously Baptized',
        hasCheck: prospect != null ? prevBaptValue : false
      });
      attendedRow = Ti.UI.createTableViewRow({
        title: 'Attended Church',
        hasCheck: prospect != null ? attendValue : false
      });
      enrolledRow = Ti.UI.createTableViewRow({
        title: 'Enrolled in Sunday School',
        hasCheck: prospect != null ? enrolledValue : false
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
      data.push(s7);
      b = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.SAVE
      });
      b.addEventListener('click', function() {
        var createdProspect, emailPattern, viewProspectWin;
        emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email.value !== '' && !email.value.match(emailPattern)) {
          alert('Invalid email address.');
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
            firstContactDate: Math.floor(initialPicker.value.getTime() / 1000),
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
            firstContactDate: Math.floor(initialPicker.value.getTime() / 1000),
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
          city.value = Ti.App.Properties.getString('defaultCity', '');
          city.blur();
          state.value = Ti.App.Properties.getString('defaultState', '');
          state.blur();
          zip.value = Ti.App.Properties.getString('defaultZip', '');
          zip.blur();
          country.value = Ti.App.Properties.getString('defaultCountry', '');
          country.blur();
          homeText.value = '';
          homeText.blur();
          mobileText.value = '';
          mobileText.blur();
          email.value = '';
          email.blur();
          initialPicker.value = new Date();
          initPickerView.animate(pickerSlideOut);
          pocTextfield.value = '';
          pocTextfield.blur();
          tableView.scrollToTop(0);
          prevSavedRow.hasCheck = false;
          prevBaptRow.hasCheck = false;
          attendedRow.hasCheck = false;
          enrolledRow.hasCheck = false;
          viewProspectWin = self.createProspectViewWindow(createdProspect);
          viewProspectWin.addEventListener('blur', function(f) {
            return this.close();
          });
          if (self.isAndroid) {
            Ti.API.info('todo');
          } else {
            viewProspectWin.setRightNavButton();
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
      tableFooterView = Ti.UI.createView({
        layout: 'vertical',
        height: 0,
        width: 300
      });
      if (this.isAndroid) {
        tableView.backgroundColor = '#181818';
        b.height = 40;
        b.width = 300;
        b.title = 'Save Prospect';
        tableFooterView.add(b);
      } else {
        win.setRightNavButton(b);
      }
      if (prospect != null) {
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
        tableFooterView.add(deleteProspectButton);
        if (this.isAndroid) {
          tableFooterView.height = 120;
        } else {
          tableFooterView.height = 60;
        }
      }
      tableView.footerView = tableFooterView;
      win.add(tableView);
      win.add(initPickerView);
      initPickerView.hide();
      win.addEventListener('open', function(e) {
        initPickerView.show();
        return win.addEventListener('focus', function(f) {
          if (city.value === '') {
            city.value = Ti.App.Properties.getString('defaultCity', '');
          }
          if (state.value === '') {
            state.value = Ti.App.Properties.getString('defaultState', '');
          }
          if (zip.value === '') {
            zip.value = Ti.App.Properties.getString('defaultZip', '');
          }
          if (country.value === '') {
            return country.value = Ti.App.Properties.getString('defaultCountry', '');
          }
        });
      });
      return win;
    };
    UI.prototype.createProspectFormWinAndroid = function(prospect) {
      var attendValue, attendedRow, city, clearForm, country, data, email, enrolledRow, enrolledValue, fields, fname, homeText, initContactDate, lname, mobileText, pocTextfield, prevBaptRow, prevBaptValue, prevSavedRow, prevSavedValue, s7, scrollView, self, sname, state, street, tableView, win, zip;
      self = this;
      win = Ti.UI.createWindow({
        title: prospect != null ? 'Edit Prospect' : 'Add Prospect',
        activity: {
          onCreateOptionsMenu: function(e) {
            var mClear, mDelete, mSave, menu;
            menu = e.menu;
            mSave = menu.add({
              title: 'Save'
            });
            mSave.addEventListener('click', function(f) {
              var createdProspect, emailPattern, formValues, homePhoneNum, mobilePhoneNum;
              emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              if (email.value !== '' && !email.value.match(emailPattern)) {
                alert('Invalid email address.');
                return false;
              }
              homePhoneNum = homeText.value.replace(/[^0-9]/g, '');
              mobilePhoneNum = mobileText.value.replace(/[^0-9]/g, '');
              formValues = {
                last: lname.value,
                firstMale: fname.value,
                firstFemale: sname.value,
                street: street.value,
                city: city.value,
                state: state.value,
                zip: zip.value,
                country: country.value,
                phoneHome: homePhoneNum,
                phoneMobile: mobilePhoneNum,
                email: email.value,
                firstContactDate: strtotime(initContactDate.value),
                firstContactPoint: pocTextfield.value,
                previouslySaved: prevSavedRow.hasCheck ? "1" : "0",
                previouslyBaptized: prevBaptRow.hasCheck ? "1" : "0",
                attended: attendedRow.hasCheck ? "1" : "0",
                sundaySchool: enrolledRow.hasCheck ? "1" : "0"
              };
              if (prospect != null) {
                shl.Prospect.update(prospect.id, formValues);
                clearForm();
                win.exitValue = true;
                return win.close();
              } else {
                createdProspect = shl.Prospect.create(formValues);
                clearForm();
                return alert('Prospect created');
              }
            });
            if (prospect != null) {
              mDelete = menu.add({
                title: 'Delete'
              });
              return mDelete.addEventListener('click', function(f) {
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
            } else {
              mClear = menu.add({
                title: 'Clear'
              });
              return mClear.addEventListener('click', function(f) {
                return clearForm();
              });
            }
          }
        }
      });
      clearForm = function() {
        var field, _i, _len;
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
          field.value = '';
        }
        city.value = Ti.App.Properties.getString('defaultCity', '');
        state.value = Ti.App.Properties.getString('defaultState', '');
        zip.value = Ti.App.Properties.getString('defaultZip', '');
        country.value = Ti.App.Properties.getString('defaultCountry', '');
        return initContactDate.value = date('n/j/Y');
      };
      scrollView = Ti.UI.createScrollView({
        contentWidth: 'auto',
        contentHeight: 'auto',
        top: 0,
        showVerticalScrollIndicator: true,
        layout: 'vertical'
      });
      fields = [];
      fname = Ti.UI.createTextField({
        height: 40,
        width: 300,
        top: 0,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'First Name Male',
        value: prospect != null ? prospect.firstMale : ''
      });
      fields.push(fname);
      scrollView.add(fname);
      sname = Ti.UI.createTextField({
        height: 40,
        width: 300,
        top: 0,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'First Name Female',
        value: prospect != null ? prospect.firstFemale : ''
      });
      fields.push(sname);
      scrollView.add(sname);
      lname = Ti.UI.createTextField({
        height: 40,
        width: 300,
        left: 10,
        top: 0,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'Last Name',
        value: prospect != null ? prospect.last : ''
      });
      fields.push(lname);
      scrollView.add(lname);
      street = Ti.UI.createTextField({
        height: 40,
        width: 300,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'Street',
        value: prospect != null ? prospect.street : ''
      });
      fields.push(street);
      scrollView.add(street);
      city = Ti.UI.createTextField({
        width: 300,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'City',
        value: prospect != null ? prospect.city : Ti.App.Properties.getString('defaultCity', '')
      });
      fields.push(city);
      scrollView.add(city);
      state = Ti.UI.createTextField({
        width: 139,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'State',
        value: prospect != null ? prospect.state : Ti.App.Properties.getString('defaultState', '')
      });
      fields.push(state);
      scrollView.add(state);
      zip = Ti.UI.createTextField({
        width: 139,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'Zip',
        value: prospect != null ? prospect.zip : Ti.App.Properties.getString('defaultZip', '')
      });
      fields.push(zip);
      scrollView.add(zip);
      country = Ti.UI.createTextField({
        width: 139,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'Country',
        value: prospect != null ? prospect.country : Ti.App.Properties.getString('defaultCountry', '')
      });
      fields.push(country);
      scrollView.add(country);
      homeText = Ti.UI.createTextField({
        width: 200,
        height: 40,
        left: 10,
        hintText: 'Home Phone',
        keyboardType: Titanium.UI.KEYBOARD_PHONE_PAD,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        value: prospect != null ? prospect.phoneHome : ''
      });
      fields.push(homeText);
      scrollView.add(homeText);
      mobileText = Ti.UI.createTextField({
        width: 200,
        height: 40,
        left: 10,
        hintText: 'Mobile Phone',
        keyboardType: Titanium.UI.KEYBOARD_PHONE_PAD,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        value: prospect != null ? prospect.phoneMobile : ''
      });
      fields.push(mobileText);
      scrollView.add(mobileText);
      email = Ti.UI.createTextField({
        width: 300,
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
      fields.push(email);
      scrollView.add(email);
      initContactDate = Ti.UI.createTextField({
        hintText: '1/10/2011',
        value: prospect != null ? date('n/j/Y', prospect.firstContactDate) : date('n/j/Y'),
        height: 40,
        width: 120,
        left: 10,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
      });
      fields.push(initContactDate);
      scrollView.add(initContactDate);
      pocTextfield = Ti.UI.createTextField({
        width: 300,
        height: 40,
        left: 10,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType: Titanium.UI.RETURNKEY_DONE,
        borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
        hintText: 'Point of Contact',
        value: prospect != null ? prospect.firstContactPoint : ''
      });
      fields.push(pocTextfield);
      scrollView.add(pocTextfield);
      data = [];
      s7 = Ti.UI.createTableViewSection();
      if (prospect != null) {
        prevSavedValue = prospect.previouslySaved.toFixed() == 1 ? true : false;
        prevBaptValue = prospect.previouslyBaptized.toFixed() == 1 ? true : false;
        attendValue = prospect.attended.toFixed() == 1 ? true : false;
        enrolledValue = prospect.sundaySchool.toFixed() == 1 ? true : false;
      }
      prevSavedRow = Ti.UI.createTableViewRow({
        title: 'Previously Saved',
        hasCheck: prospect != null ? prevSavedValue : false
      });
      prevBaptRow = Ti.UI.createTableViewRow({
        title: 'Previously Baptized',
        hasCheck: prospect != null ? prevBaptValue : false
      });
      attendedRow = Ti.UI.createTableViewRow({
        title: 'Attended Church',
        hasCheck: prospect != null ? attendValue : false
      });
      enrolledRow = Ti.UI.createTableViewRow({
        title: 'Enrolled in Sunday School',
        hasCheck: prospect != null ? enrolledValue : false
      });
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
      s7.add(prevSavedRow);
      s7.add(prevBaptRow);
      s7.add(attendedRow);
      s7.add(enrolledRow);
      data.push(s7);
      tableView = Ti.UI.createTableView({
        data: data,
        height: 200
      });
      scrollView.add(tableView);
      win.add(scrollView);
      Ti.App.addEventListener('AddFormUpdate', function(e) {
        return clearForm();
      });
      return win;
    };
    return UI;
  })();
  shl.ui = new UI;
}).call(this);
