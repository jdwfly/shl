# All User Interface stuff is going into this class
class UI
  constructor : () ->
    @isAndroid = if Ti.Platform.name is 'android' then true else false
    @platform = Ti.Platform.name
    #@tabs = @createApplicationTabGroup()
  
  createApplicationTabGroup : () ->
    tabs = Ti.UI.createTabGroup()
    
    # Create main windows
    stats = @createStatsWindow()
    
    # Create main tabs
    listsTab = shl.listsTab.tab
    starredTab = shl.starredTab.tab
    addTab = shl.addTab.tab
    searchTab = shl.searchTab.tab
    statsTab = Ti.UI.createTab({
      title: 'Stats',
      window: stats,
      icon: 'images/16-line-chart.png'
    })
    ###
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
    ###
    
    # Add tabs to the tabgroup
    tabs.addTab(listsTab)
    tabs.addTab(starredTab)
    tabs.addTab(addTab)
    tabs.addTab(searchTab)
    tabs.addTab(statsTab)
    #tabs.addTab(nearbyTab)
    #tabs.addTab(settingsTab)
    #tabs.addTab(helpTab)
    tabs.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT})
    @tabs = tabs
    
    return tabs
  
  createStatsWindow : () ->
   self = this
   statsWin = Ti.UI.createWindow({
     title : 'My Outreach Stats'
   })
   #statsView = @getStats() 
   
   view = Ti.UI.createView()
   allTime = Ti.UI.createLabel ({
     text: 'Total',
     top: 10,
     left: 10,
     height: 'auto',
     width: 200
   })
   view.add(allTime)
   aVisits = shl.Contact.count({
     where: {
       type: 'Visit'
     }
   })
   aVisitTxt = Ti.UI.createLabel ({
     text: 'Visits: ' + aVisits,
     top: 30,
     left: 20,
     height: 'auto',
     width: 200
   })
   view.add(aVisitTxt)
   aCalls = shl.Contact.count({
     where: {
       type: 'Phone Call'
     }
   })
   aCallsTxt = Ti.UI.createLabel ({
     text: 'Phone Calls: ' + aCalls,
     top: 50,
     left: 20,
     height: 'auto',
     width: 200
   })
   view.add(aCallsTxt)
   aSal = shl.Contact.count({
     where: {
       type: 'Saved'
     }
   })
   aSalTxt = Ti.UI.createLabel ({
     text: 'Saved: ' + aSal,
     top: 70,
     left: 20,
     height: 'auto',
     width: 200
   })
   view.add(aSalTxt)
   aBap = shl.Contact.count({
      where: {
        type: 'Baptized'
      }
    })
   aBapTxt = Ti.UI.createLabel({
     text: 'Baptized: ' + aBap,
     top: 90,
     left: 20,
     height: 'auto',
     width: 200
   })
   view.add(aBapTxt)
   
   
   thisMonth = Ti.UI.createLabel ({
      text: 'Last 30 Days',
      top: 110,
      left: 10,
      height: 'auto',
      width: 200
    })
    view.add(thisMonth)
    mVisits = shl.Contact.count({
      where : "type = 'Visit' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mVisitTxt = Ti.UI.createLabel ({
      text: 'Visits: ' + mVisits,
      top: 130,
      left: 20,
      height: 'auto',
      width: 200
    })
    view.add(mVisitTxt)
    mCalls = shl.Contact.count({
      where : "type = 'Phone Call' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mCallsTxt = Ti.UI.createLabel ({
      text: 'Phone Calls: ' + mCalls,
      top: 150,
      left: 20,
      height: 'auto',
      width: 200
    })
    view.add(mCallsTxt)
    mSal = shl.Contact.count({
      where : "type = 'Saved' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mSalTxt = Ti.UI.createLabel ({
      text: 'Saved: ' + mSal,
      top: 170,
      left: 20,
      height: 'auto',
      width: 200
    })
    view.add(mSalTxt)
    mBap = shl.Contact.count({
       where : "type = 'Baptized' AND date > (strftime('%s', 'now') - 2592000)"
     })
    mBapTxt = Ti.UI.createLabel({
      text: 'Baptized: ' + mBap,
      top: 190,
      left: 20,
      height: 'auto',
      width: 200
    })
    view.add(mBapTxt)
   statsWin.add(view)
   statsWin.addEventListener('open', (f) ->
      statsWin.addEventListener('focus', (g) ->
        aVisits = shl.Contact.count({
          where: {
            type: 'Visit'
          }
        })
        aVisitTxt.text = 'Visits: ' + aVisits
        aCalls = shl.Contact.count({
          where: {
            type: 'Phone Call'
          }
        })
        aCallsTxt.text = 'Phone Calls: ' + aCalls
        aSal = shl.Contact.count({
          where: {
            type: 'Saved'
          }
        })
        aSalTxt.text = 'Saved: ' + aSal
        aBap = shl.Contact.count({
          where: {
            type: 'Baptized'
          }
        })
        aBapTxt.text = 'Baptized: ' + aBap
        
        
        mVisits = shl.Contact.count({
          where : "type = 'Visit' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mVisitTxt.text = 'Visits: ' + mVisits
        mCalls = shl.Contact.count({
          where : "type = 'Phone Call' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mCallsTxt.text = 'Phone Calls: ' + mCalls
        mSal = shl.Contact.count({
          where : "type = 'Saved' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mSalTxt.text = 'Saved: ' + mSal
        mBap = shl.Contact.count({
          where : "type = 'Baptized' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mBapTxt.text = 'Baptized: ' + mBap
      )
    )
   return statsWin
  
  createNearbyWindow : () ->
    @createListsWindow()
  
  createSettingsWindow : () ->
    @createListsWindow()
  
  createHelpWindow : () ->
    @createListsWindow()
  
  createAddProspectsWindow : (listId) ->
    self = this
    win = Ti.UI.createWindow({
      title : 'Add Prospects'
    })
    doneBtn = Ti.UI.createButton({
      title:'Done',
      width:100,
      height:30
    })
    doneBtn.addEventListener('click', () ->
      win.close()
    )
    win.setRightNavButton(doneBtn)
    prospects = shl.Prospect.find()
    if prospects.length < 1
      return win
    createRow = (prospect)->
      row = Ti.UI.createTableViewRow({
        height: 70
      })
      contentTitle = Ti.UI.createLabel({
        text: prospect.formatName(),
        font: {fontWeight: 'bold', fontSize:18},
        height: 30,
        top : 5,
        width: 'auto',
        left: 5
      })
      addressLabel = Ti.UI.createLabel({
        text: prospect.formatAddress(),
        font: {fontWeight: 'normal', fontSize: 12},
        height: 35,
        width: 'auto',
        height: 'auto',
        top: 33,
        left: 5,
        bottom: 5
      })
      row.add(contentTitle)
      row.add(addressLabel)
      row.prospect = prospect
      addBtn = Ti.UI.createButton({
        backgroundImage:'/images/addDefault.png',
        height:27,
        width:27,
        right:10,
        top: 20
      })
      addBtn.addEventListener('click', () ->
        Ti.API.info(prospect)
        shl.Listing.create {
          list_id : listId,
          prospect_id : prospect.id
        }
        row.backgroundColor = '#AAAAAA'
        setTimeout( () ->
          deleteBtn.show()
        ,100)
        addBtn.hide()
        contentTitle.animate({left:50, duration:100})
        addressLabel.animate({left:50, duration:100})
      )
      row.add(addBtn)
      deleteBtn = Ti.UI.createButton({
        backgroundImage:'/images/minusDefault.png',
        height:27,
        width:27,
        left:10,
        top: 20,
        visible:false
      })
      deleteBtn.addEventListener('click', () ->
        todelete = shl.Listing.find({
          where : {
            prospect_id : prospect.id,
            list_id : listId
          }
        })
        for listing in todelete
          listing.destroy()
        row.backgroundColor = '#ffffff'
        deleteBtn.hide()
        addBtn.show()
        contentTitle.animate({left:10, duration:100})
        addressLabel.animate({left:10, duration:100})
      )
      row.add(deleteBtn)
      currentList = shl.List.find(listId)
      prospectsList = currentList.getProspectList()
      listMembers = for prosp in prospectsList
        prosp.id
      if prospect.id in listMembers
        deleteBtn.visible = true
        addBtn.visible = false
        contentTitle.left = 55
        addressLabel.left = 55
      row
    
    data = for prospect in prospects
      createRow(prospect)
    
    tableView = Ti.UI.createTableView({data:data})
    
    win.add(tableView)
    #TODO set this diferently for Android
    return win
  
  createProspectTableView : (prospects) ->
    self = this
    data = @processProspectData(prospects)
    tableView = Ti.UI.createTableView({
      data:data
    })
    tableView.addEventListener('click', (e) ->
      # don't do anything if the star was clicked
      dataSourceString = e.source + ''
      if dataSourceString.indexOf('TiUIImageView') isnt -1
        return true
      if not tableView.editing
        Ti.API.info(JSON.stringify(e.row))
        prospectWin = self.createProspectViewWindow(e.row.prospect)
        self.tabs.activeTab.open(prospectWin)
    )
    tableView.updateProspects = (prospects) ->
      data = self.processProspectData(prospects)
      @setData(data)
    return tableView
  
  # prospect = loaded prospect model
  # returns a window
  createProspectViewWindow : (prospect) ->
    prospect = shl.Prospect.find(prospect.id)
    win = Ti.UI.createWindow()
    self = this
    data = @processProspectViewData(prospect)
    
    tableView = Ti.UI.createTableView({
      data: data.data,
      headerView: data.headerView,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    })
    tableView.updateProspect = (prospect) ->
      data = self.processProspectViewData(prospect)
      @setData(data.data)
      @headerView = data.headerView
    
    if @platform is 'iPhone OS'
      editButton = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.EDIT
      })
      editButton.addEventListener('click', (e) ->
        # Open modal window to edit prospect
        editProspect = shl.Prospect.find(prospect.id)
        editWin = self.createProspectFormWin(editProspect)
        editWin.addEventListener('close', (e) ->
          # Update the current information on the page
          if e.source.exitValue
            tableView.updateProspect(prospect)
          else if @deleteProspect
            win.close()
        )
        editWin.open({
          modal:true,
          modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
          modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        })
      )
      win.setRightNavButton(editButton)
    
    win.addEventListener('open', (e) ->
      win.addEventListener('focus', (f) ->
        updateProspect = shl.Prospect.find(prospect.id)
        tableView.updateProspect(updateProspect)
      )
    )
    
    win.add(tableView)
    return win
    
  processProspectViewData : (prospect) ->
    self = this
    data = {}
    prospect = shl.Prospect.find(prospect.id)
    
    headerView = Ti.UI.createView({
      height: '116'
    })
    nameLabel = Ti.UI.createLabel({
      text: prospect.formatName(),
      left: 10,
      top: 7,
      width: 300,
      height: 24,
      color: '#4c596e',
      font: {fontSize: 20}
    })
    contactLabel = Ti.UI.createLabel({
      text: 'Last Contact: ' + prospect.formatContactPretty(),
      left: 10,
      top: 25,
      width: 300,
      height: 17,
      font: {fontSize: 12},
      color: '#4c596e'
    })
    nextStepLabel = Ti.UI.createLabel({
      text: 'Next Step: ' + prospect.nextStep,
      left: 10,
      top: 39,
      width: 300,
      height: 17,
      font: {fontSize: 12},
      color: '#4c596e'
    })
    recordContactButton = Ti.UI.createButton({
      width: 300,
      height: 57,
      top: 56,
      left: 10,
      title: 'Record Contact',
      color: '#fff',
      backgroundImage: '/images/button_blue.png'
    })
    recordContactButton.addEventListener('click', (e) ->
      # TODO : create modal window to add contact
      recordContactWin = Ti.UI.createWindow({
        backgroundColor: '#ffffff',
        navBarHidden: true
      })
      recordContactRoot = Ti.UI.createWindow({
        title: 'Record Contact'
      })
      if self.platform is 'iPhone OS'
        closeButton = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.CANCEL
        })
        closeButton.addEventListener('click', (e) ->
          recordContactWin.close()
        )
        recordContactRoot.setLeftNavButton(closeButton)
        saveButton = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.SAVE
        })
        saveButton.addEventListener('click', (e) ->
          # Convert the date
          re = /^\d{1,2}\/\d{1,2}\/\d{4}$/
          if dateField.value isnt '' and not dateField.value.match(re)
            alert('Invalid date format. Please format date MM/DD/YYYY')
            return false
          if dateField.value is ''
            dateValue = 0
          else
            dateValue = strtotime(dateField.value)
            thisTime = new Date()
            dateValue = dateValue + (thisTime.getHours() * 3600) + (thisTime.getMinutes() * 60) + thisTime.getSeconds()
            Ti.API.info(dateValue)
          # Get the type of contact
          groupHasCheck = false
          for row, i in visitSection.rows
            if visitSection.rows[i].hasCheck
              typeValue = visitSection.rows[i].title
              groupHasCheck = true
          if groupHasCheck is false
            alert('You must select the type of visit.')
            return false
          # Get the comments
          commentsValue = commentsTextArea.value
          createdContacts = []
          createdContacts.push(prospect.createContact({
            type: typeValue,
            date: dateValue,
            comments: commentsValue
          }))
          if decisionSection.rows.length > 1
            for row, i in decisionSection.rows
              if not decisionSection.rows[i].hasChild
                createdContacts.push(prospect.createContact({
                  type: decisionSection.rows[i].decisionType,
                  date: dateValue,
                  individual: decisionSection.rows[i].decisionPerson
                }))
          recordContactWin.close()
        )
        recordContactRoot.setRightNavButton(saveButton)
      
      recordContactNav = Ti.UI.iPhone.createNavigationGroup({
        window: recordContactRoot
      })
      tdata = []
      
      today = new Date()
      dateSection = Ti.UI.createTableViewSection({
        headerTitle: prospect.formatName()
      })
      dateRow = Ti.UI.createTableViewRow()
      dateField = Ti.UI.createTextField({
        height: 35,
        width: 300,
        left: 7,
        value: (today.getMonth()+1) + '/' + today.getDate() + '/' + today.getFullYear(),
        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
        returnKeyType:Titanium.UI.RETURNKEY_DONE,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
      })
      dateRow.add(dateField)
      dateSection.add(dateRow)
      tdata.push(dateSection)
      
      visitSection = Ti.UI.createTableViewSection({
        headerTitle: 'Type of Contact'
      })
      visitRow = Ti.UI.createTableViewRow({
        title: 'Visit',
        hasCheck: false
      })
      letterRow = Ti.UI.createTableViewRow({
        title: 'Letter',
        hasCheck: false
      })
      visitedChurchRow = Ti.UI.createTableViewRow({
        title: 'Visited Church',
        hasCheck: false
      })
      phoneRow = Ti.UI.createTableViewRow({
        title: 'Phone Call',
        hasCheck: false
      })
      emailRow = Ti.UI.createTableViewRow({
        title: 'Email',
        hasCheck: false        
      })
      commentRow = Ti.UI.createTableViewRow({
        title: 'Comment',
        hasCheck: false
      })
      visitSection.add(visitRow)
      visitSection.add(letterRow)
      visitSection.add(visitedChurchRow)
      visitSection.add(phoneRow)
      visitSection.add(emailRow)
      visitSection.add(commentRow)
      visitSection.addEventListener('click', (e) ->
        for row, i in visitSection.rows
          # e.index is off by one because there is one row already
          if i is (e.index - 1)
            visitSection.rows[i].hasCheck = true
          else
            visitSection.rows[i].hasCheck = false
      )
      tdata.push(visitSection)
      
      commentSection = Ti.UI.createTableViewSection({
        headerTitle: 'Comments'
      })
      commentsRow = Ti.UI.createTableViewRow({
        height: 100
      })
      commentsTextArea = Ti.UI.createTextArea({
        width: 280,
        height: 75,
        left: 7,
        keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
        returnKeyType:Titanium.UI.RETURNKEY_DONE,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
      })
      commentsRow.add(commentsTextArea)
      commentSection.add(commentsRow)
      tdata.push(commentSection)
      
      decisionSection = Ti.UI.createTableViewSection()
      recordDecisionRow = Ti.UI.createTableViewRow({
        title: 'Record Decision',
        hasChild: true
      })
      recordDecisionRow.addEventListener('click', (e) ->
        # create the add decision window
        rowIndex = e.index
        recordDecisionWin = Ti.UI.createWindow({
          title: 'Record Decision',
          backgroundColor: '#ffffff'
        })
        typeData = []
        typeDecisionSection = Ti.UI.createTableViewSection({
          headerTitle: prospect.formatName()
        })
        savedRow = Ti.UI.createTableViewRow({
          title: 'Saved',
          hasCheck: false
        })
        baptizedRow = Ti.UI.createTableViewRow({
          title: 'Baptized',
          hasCheck: false
        })
        joinedRow = Ti.UI.createTableViewRow({
          title: 'Joined the Church',
          hasCheck: false
        })
        typeDecisionSection.add(savedRow)
        typeDecisionSection.add(baptizedRow)
        typeDecisionSection.add(joinedRow)
        typeDecisionSection.addEventListener('click', (e) ->
          for row, i in typeDecisionSection.rows
            if i is e.index
              typeDecisionSection.rows[i].hasCheck = true
            else
              typeDecisionSection.rows[i].hasCheck = false
        )
        typeData.push(typeDecisionSection)
        
        decisionMakerSection = Ti.UI.createTableViewSection()
        if prospect.firstMale isnt ''
          maleRow = Ti.UI.createTableViewRow({
            title: prospect.firstMale,
            hasCheck: false
          })
          decisionMakerSection.add(maleRow)
        if prospect.firstFemale isnt ''
          femaleRow = Ti.UI.createTableViewRow({
            title: prospect.firstFemale,
            hasCheck: false
          })
          decisionMakerSection.add(femaleRow)
        otherRow = Ti.UI.createTableViewRow({
          hasCheck: false
        })
        otherTextField = Ti.UI.createTextField({
          height: 35,
          width: 270,
          left: 7,
          keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
          returnKeyType:Titanium.UI.RETURNKEY_DONE,
          borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
          hintText: 'Other Family Member'
        })
        otherTextField.addEventListener('blur', (e) ->
          if maleRow? then maleRow.hasCheck = false
          if femaleRow? then femaleRow.hasCheck = false
          otherRow.hasCheck = true
        )
        otherRow.add(otherTextField)
        decisionMakerSection.add(otherRow)
        decisionMakerSection.addEventListener('click', (e) ->
          for row, i in decisionMakerSection.rows
            if i is (e.index - 3)
              decisionMakerSection.rows[i].hasCheck = true
              otherRow.hasCheck = false
            else
              decisionMakerSection.rows[i].hasCheck = false
        )
        typeData.push(decisionMakerSection)
        footerView = Ti.UI.createView({
          height: 50,
          width: 300,
          left: 0
        })
        saveButton = Ti.UI.createButton({
          title: 'Save',
          backgroundImage: 'images/button_blue.png',
          width: 300,
          height: 50
        })
        saveButton.addEventListener('click', (e) ->
          # Save and go back to other window in the navgroup
          # Loop through the two sections to find the one that hasCheck
          decisionTitle = ''
          decisionType = ''
          decisionPerson = ''
          groupHasCheck = false
          for row, i in typeDecisionSection.rows
            if typeDecisionSection.rows[i].hasCheck is true
              decisionType = typeDecisionSection.rows[i].title
              decisionTitle += typeDecisionSection.rows[i].title + ' - '
              groupHasCheck = true
          # Makes sure something was checked for the type of decision
          if groupHasCheck is false
            alert('You must choose the type of decision.')
            return false
          groupHasCheck = false
          for row, i in decisionMakerSection.rows
            if decisionMakerSection.rows[i].hasCheck is true
              if decisionMakerSection.rows[i].title? and decisionMakerSection.rows[i].title isnt ''
                decisionPerson = decisionMakerSection.rows[i].title
                decisionTitle += decisionMakerSection.rows[i].title
              else
                decisionPerson = otherTextField.value
                decisionTitle += otherTextField.value
              groupHasCheck = true
          # Makes sure something was checked for the person making the decision
          if groupHasCheck is false
            alert('You must choose the person who made the decision.')
            return false
          newDecisionRow = Ti.UI.createTableViewRow({
            title: decisionTitle,
            decisionType: decisionType,
            decisionPerson: decisionPerson,
            editable: true
          })
          contactTableView.insertRowBefore(rowIndex, newDecisionRow)
          recordContactNav.close(recordDecisionWin)
        )
        footerView.add(saveButton)
        
        typeDecisionTableView = Ti.UI.createTableView({
          data: typeData,
          style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
          footerView: footerView
        })
        recordDecisionWin.add(typeDecisionTableView)
        
        recordContactNav.open(recordDecisionWin)
      )
      decisionSection.add(recordDecisionRow)
      tdata.push(decisionSection)
      
      contactTableView = Ti.UI.createTableView({
        data: tdata, 
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      })
      recordContactRoot.add(contactTableView)
      recordContactWin.add(recordContactNav)
      
      recordContactWin.open({
        modal:true,
        modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
        modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
      })
    )
    headerView.add(nameLabel)
    headerView.add(contactLabel)
    headerView.add(nextStepLabel)
    headerView.add(recordContactButton)
    data.headerView = headerView
    data.data = []
    
    if prospect.formatAddress() isnt ''
      addressSection = Ti.UI.createTableViewSection()
      addressRow = Ti.UI.createTableViewRow({height: 75})
      addressLabel = Ti.UI.createLabel({
        text: prospect.formatAddress()
        left: 10
      })
      addressRow.add(addressLabel)
      addressSection.add(addressRow)
      addressSection.addEventListener('click', (e) ->
        query = prospect.formatAddressGoogle()
        query = query.replace /[ ]/gi, "+"
        Ti.API.info(query)
        Ti.Platform.openURL("http://maps.google.com/maps?q="+query)
      )
      data.data.push(addressSection)
    
    if prospect.phoneHome isnt '' and prospect.phoneMobile isnt ''
      phoneSection = Ti.UI.createTableViewSection()
      if prospect.phoneHome isnt ''
        phoneHomeRow = Ti.UI.createTableViewRow()
        phoneHomeLabel = Ti.UI.createLabel({
          text: 'home: ' + prospect.phoneHome,
          phone: prospect.phoneHome,
          left: 10
        })
        phoneHomeRow.add(phoneHomeLabel)
        phoneSection.add(phoneHomeRow)
      if prospect.phoneMobile isnt ''
        phoneMobileRow = Ti.UI.createTableViewRow()
        phoneMobileLabel = Ti.UI.createLabel({
          text: 'mobile: ' + prospect.phoneMobile,
          phone: prospect.phoneMobile,
          left: 10
        })
        phoneMobileRow.add(phoneMobileLabel)
        phoneSection.add(phoneMobileRow)
      # TODO: Test on device to see if this works
      phoneSection.addEventListener('click', (e) ->
        Ti.Platform.openURL('tel:' + e.source.phone)
      )
      data.data.push(phoneSection)
      
    if prospect.email isnt ''
      emailSection = Ti.UI.createTableViewSection()
      emailRow = Ti.UI.createTableViewRow()
      emailLabel = Ti.UI.createLabel({
        text: prospect.email,
        left: 10
      })
      emailRow.add(emailLabel)
      emailSection.add(emailRow)
      # TODO: Test on device to ensure email sends
      emailSection.addEventListener('click', (e) ->
        emailDialog = Ti.UI.createEmailDialog()
        emailDialog.toRecipients = [e.source.text]
        emailDialog.open()
      )
      data.data.push(emailSection)
    
    bogusSection = Ti.UI.createTableViewSection({headerTitle: 'Decisions'})
    if prospect.previouslySaved
      prevSavedRow = Ti.UI.createTableViewRow({title: 'Previously Saved'})
      bogusSection.add(prevSavedRow)
    if prospect.previouslyBaptized
      prevBaptRow = Ti.UI.createTableViewRow({title: 'Previously Baptized'})
      bogusSection.add(prevBaptRow)
    if prospect.attended
      attendedRow = Ti.UI.createTableViewRow({title: 'Attended Church'})
      bogusSection.add(attendedRow)
    if prospect.sundaySchool
      essRow = Ti.UI.createTableViewRow({title: 'Enrolled in Sunday School'})
      bogusSection.add(essRow)
    decisionList = prospect.getContactList({
      where: 'prospect_id = '+prospect.id+' AND (type = "Saved" OR type="Baptized" OR type="Joined the Church")'
    })
    if decisionList.length >= 1
      for decision in decisionList
        decisionRow = Ti.UI.createTableViewRow({
          title: decision.individual + " - " + decision.type + " " + date('n/j/Y', decision.date)
        })
        bogusSection.add(decisionRow)
    Ti.API.info(decisionList)
    if !bogusSection.rows?
      bogusNoneRow = Ti.UI.createTableViewRow({title: 'None', name: 'bogusNone'})
      bogusSection.add(bogusNoneRow)
    ###
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
    ###
    data.data.push(bogusSection)
    
    firstContactSection = Ti.UI.createTableViewSection()
    firstContactRow = Ti.UI.createTableViewRow({height: 55})
    firstContactLabel = Ti.UI.createLabel({
      text: 'First Contact: ' + date('n/j/Y', prospect.firstContactDate) + "\n" + prospect.firstContactPoint
      left: 10
    })
    firstContactRow.add(firstContactLabel)
    firstContactSection.add(firstContactRow)
    data.data.push(firstContactSection)
    
    statusSection = Ti.UI.createTableViewSection()
    statusRow = Ti.UI.createTableViewRow({hasChild: true})
    statusLabel = Ti.UI.createLabel({
      text: 'Status',
      left: 10
    })
    statusValueLabel = Ti.UI.createLabel({
      text: prospect.status,
      width: 'auto',
      height: 'auto',
      right: 5,
      color: '#395587',
      font: {fontSize: 12}
    })
    statusRow.addEventListener('click', (e) ->
      statusWin = Ti.UI.createWindow({
        title: 'Status'
      })
      statusTableView = Ti.UI.createTableView({
        data: [
          {title: 'Active Prospect', hasCheck: if prospect.status is 'Active Prospect' then true else false},
          {title: 'Inactive Prospect', hasCheck: if prospect.status is 'Inactive Prospect' then true else false},
          {title: 'Member', hasCheck: if prospect.status is 'Member' then true else false},
          {title: 'Dead End', hasCheck: if prospect.status is 'Dead End' then true else false}
        ],
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      })
      statusTableView.addEventListener('click', (e) ->
        Ti.API.info(JSON.stringify(e.rowData))
        for row, i in statusTableView.data[0].rows
          Ti.API.info(JSON.stringify(row))
          if i is e.index
            statusTableView.data[0].rows[i].hasCheck = true
            prospect.updateAttribute('status', statusTableView.data[0].rows[i].title)
          else
            statusTableView.data[0].rows[i].hasCheck = false
      )
      statusWin.add(statusTableView)
      self.tabs.activeTab.open(statusWin)
    )
    statusRow.add(statusLabel)
    statusRow.add(statusValueLabel)
    statusSection.add(statusRow)
    data.data.push(statusSection)
    
    contacts = prospect.getContactList({
      order: 'date DESC'
    })
    contactSection = Ti.UI.createTableViewSection({headerTitle: 'Activity Log'})
    if contacts.length < 1
      noneRow = Ti.UI.createTableViewRow({
        title: 'None'
        name: 'None'
      })
      contactSection.add(noneRow)
    else
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
        contactSection.add(row)
    ###
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
    ###
    data.data.push(contactSection)
    
    return data
  
  processListData : (lists) ->
    data = for i in lists
      row = Ti.UI.createTableViewRow({
        height: 45,
        hasChild: true,
        title: i.name,
        listID: i.id,
        editable: false,
        moveable: true
      })
      if shl.aLists[i.name]?
        listcount = shl.Prospect.count(shl.aLists[i.name].query)
      else
        currentList = shl.List.find(i.id)
        listcount = currentList.getProspectCount()
      countView = Ti.UI.createLabel({
        text: listcount,
        #backgroundImage:'/images/count-bg.png',
        fontSize: 12,
        height: 21,
        width: 36,
        #top: 5,
        textAlign: 'center',
        right: 5,
        color: '#616161'
      })
      row.add(countView)
      row
    addCustom = Ti.UI.createTableViewRow({
      height: 45,
      title: 'Create Custom List...',
      listID: 'custom',
      editable: false,
      moveable: false
    })
    data.push(addCustom)
    viewMore = Ti.UI.createTableViewRow({
      height: 45,
      title: 'View All Lists',
      listID: 'more',
      editable: false,
      moveable: false,
      name: 'more'
    })
    data.push(viewMore)
    return data
  
  processProspectData : (prospects) ->
    if prospects.length < 1
      row = Ti.UI.createTableViewRow({editable: false})
      return [row]
    data = for prospect in prospects
      row = Ti.UI.createTableViewRow({
        height: 'auto',
        hasChild: true,
        selectedBackgroundColor: '#ffffff',
        searchTerm: prospect.formatName() + ' ' + prospect.formatAddress()
      })
      content = Ti.UI.createView({
        height: 'auto',
        layout: 'vertical',
        left: 25,
        top: 10,
        bottom: 10,
        right: 10
      })
      contentTitle = Ti.UI.createLabel({
        text: prospect.formatName(),
        font: {fontWeight: 'bold', fontSize:18},
        height: 'auto',
        width: 'auto',
        left: 5
      })
      lastContactLabel = Ti.UI.createLabel({
        text: 'Last Contact: ' + prospect.formatContactPretty(),
        font: {fontWeight: 'normal', fontSize: 12},
        height: 'auto',
        width: 'auto',
        left: 5
      })
      addressLabel = Ti.UI.createLabel({
        text: prospect.formatAddress(),
        font: {fontWeight: 'normal', fontSize: 12},
        height: 'auto',
        width: 'auto',
        left: 5
      })
      ###
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
      ###
      starImage = Ti.UI.createImageView({
        url: if prospect.isStarred() then 'images/star-on.png' else 'images/star-off.png',
        width: 30,
        height: 30,
        left: 0,
        top: 5,
        prospectID: prospect.id
      })
      starImage.addEventListener('click', (e) ->
        if @url is 'images/star-off.png'
          @url = 'images/star-on.png'
          starList = shl.List.find(1)
          starList.createListing({
            prospect_id: @prospectID
          })
        else
          @url = 'images/star-off.png'
          z = shl.Listing.find({
            first: true,
            where: {
              list_id: 1,
              prospect_id: @prospectID
            }
          })
          z.destroy()
      )
      #row.add(nextstepLabel)
      row.add(starImage)
      content.add(contentTitle)
      content.add(lastContactLabel)
      content.add(addressLabel)
      row.add(content)
      row.prospect = prospect
      row
  # Create the form to either add or edit a prospect
  createProspectFormWin : (prospect) ->
    self = this
    win = Ti.UI.createWindow({
      title: if prospect? then 'Edit Prospect' else 'Add Prospect',
      backgroundColor:'#eeeeee'
    })
    data = []
    s1 = Ti.UI.createTableViewSection()
    # First Name Field
    fnameRow = Ti.UI.createTableViewRow({
      height: 40,
      layout: "vertical",
      selectionStyle: "none" 
    })
    fname = Ti.UI.createTextField({
      height:40,
      top:0,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('First Name Male'),
      value: if prospect? then prospect.firstMale else ''
    })
    fnameRow.add(fname)
    
    nameSep = Ti.UI.createTextField({
      height: 1,
      backgroundColor: '#cccccc',
      visible: false,
      zindex: -10
    })
    fnameRow.add(nameSep)
    # Second Name Field
    #snameRow = Ti.UI.createTableViewRow({
    #  height: 40,
    #  layout: "vertical",
    #  selectionStyle: "none"
    #})
    sname = Ti.UI.createTextField({
      height: 40,
      top: -40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('First Name Female'),
      value: if prospect? then prospect.firstFemale else ''
    })
    fnameRow.add(sname)
    sname.hide()
    #s1.add(snameRow)
    s1.add(fnameRow)
    # Last Name Field
    lnameRow = Ti.UI.createTableViewRow({
      height: 40,
      layout: "vertical",
      selectionStyle: "none" 
    })
    lname = Ti.UI.createTextField({
      height:40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Last Name'),
      value: if prospect? then prospect.last else ''
    })
    lnameRow.add(lname)
    s1.add(lnameRow)
    
    genderView = Ti.UI.createView({
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
      height: 50,
      selectionStyle: "none"
    })
    if @platform is 'iPhone OS'
      gender = Titanium.UI.createTabbedBar({
        labels: ['Male', 'Female', 'Couple'],
        backgroundColor: '#336699',
        style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
        height: 45,
        top: 5,
        width: 302,
        index: 0
      })
      # TODO : Create function to add/remove rows on click
      genderView.addEventListener('click', (e) ->
        if @index == 0
          nameSep.visible = false
          fnameRow.height = 40
          sname.top = -40
          sname.animate({visible:false},()->
            fname.animate({visible:true})
          )
          if not fname.value
            fname.value = sname.value
          sname.value = ''
        else if @index == 1
          nameSep.visible = false
          fnameRow.height = 40
          fname.animate({visible:false},()->
            sname.animate({visible:true})
          )
          sname.top = -40
          if not sname.value
            sname.value = fname.value
          fname.value = ''
        else
          fnameRow.height = 80
          fname.animate({visible:true},()->
            sname.animate({top:0})
            nameSep.visible = true
          )
          sname.animate({visible:true})
      )
      genderView.add(gender)
    if fname.value != '' and sname.value != ''
      fnameRow.height = 80
      fname.animate({visible:true},()->
        sname.animate({top:0})
        nameSep.visible = true
      )
      sname.animate({visible:true})
    else if sname.value != ''
      nameSep.visible = false
      fnameRow.height = 40
      fname.animate({visible:false},()->
        sname.animate({visible:true})
      )
      sname.top = -40
      if not sname.value
        sname.value = fname.value
      fname.value = ''
    s1.footerView = genderView
    data.push(s1)
    
    
    # TODO add spacing to front of fields
    s3 = Ti.UI.createTableViewSection()
    streetRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "vertical",
      selectionStyle: "none"
    })
    street = Ti.UI.createTextField({
      height:40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Street'),
      value: if prospect? then prospect.street else ''
    })
    streetRow.add(street)
    s3.add(streetRow)
    citystateRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "horizontal",
      selectionStyle: "none"
    })
    city = Ti.UI.createTextField({
      width: 139,
      height:40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('City'),
      value: if prospect? then prospect.city else ''
    })
    sep1 = Ti.UI.createTextField({
      width: 1,
      height: 45,
      left: 0,
      backgroundColor: '#cccccc'
    })
    state = Ti.UI.createTextField({
      width: 139,
      height: 40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('State'),
      value: if prospect? then prospect.state else ''
    })
    citystateRow.add(city)
    citystateRow.add(sep1)
    citystateRow.add(state)
    s3.add(citystateRow)
    zipcountryRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "horizontal",
      selectionStyle: "none"
    })
    zip = Ti.UI.createTextField({
      width: 139,
      height:40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Zip'),
      value: if prospect? then prospect.zip else ''
    })
    sep2 = Ti.UI.createTextField({
      width: 1,
      height: 45,
      left: 0,
      backgroundColor: '#cccccc'
    })
    # TODO Change to a picker instead of textfield
    country = Ti.UI.createTextField({
      width: 139,
      height: 40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Country'),
      value: if prospect? then prospect.country else ''
    })
    zipcountryRow.add(zip)
    zipcountryRow.add(sep2)
    zipcountryRow.add(country)
    s3.add(zipcountryRow)
    data.push(s3)
    
    # Phone Number section
    s4 = Ti.UI.createTableViewSection()
    homeRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "horizontal",
      selectionStyle: "none"
    })
    homeLabel = Ti.UI.createLabel({
      text: 'Home',
      font: {fontWeight: 'bold', fontSize: 16},
      height: 45,
      width: 75,
      left: 10
    })
    sep3 = Ti.UI.createView({
      width: 1,
      height: 45,
      left: 0,
      backgroundColor: '#cccccc'
    })
    homeText = Ti.UI.createTextField({
      width: 200,
      height:40,
      left: 5,
      keyboardType:Titanium.UI.KEYBOARD_PHONE_PAD,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      value: if prospect? then prospect.phoneHome else ''
    })
    homeRow.add(homeLabel)
    homeRow.add(sep3)
    homeRow.add(homeText)
    s4.add(homeRow)
    mobileRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "horizontal",
      selectionStyle: "none"
    })
    mobileLabel = Ti.UI.createLabel({
      text: 'Mobile',
      font: {fontWeight: 'bold', fontSize: 16},
      height: 45,
      width: 75,
      left: 10
    })
    sep4 = Ti.UI.createView({
      width: 1,
      height: 45,
      left: 0,
      backgroundColor: '#cccccc'
    })
    mobileText = Ti.UI.createTextField({
      width: 200,
      height:40,
      left: 5,
      keyboardType:Titanium.UI.KEYBOARD_PHONE_PAD,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      value: if prospect? then prospect.phoneMobile else ''
    })
    mobileRow.add(mobileLabel)
    mobileRow.add(sep4)
    mobileRow.add(mobileText)
    s4.add(mobileRow)
    data.push(s4)

    # Email field
    s5 = Ti.UI.createTableViewSection()
    emailRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "horizontal",
      selectionStyle: "none"
    })
    email = Ti.UI.createTextField({
      width: 280,
      height: 40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_EMAIL,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
      autocorrect: false,
      hintText:L('Email'),
      value: if prospect? then prospect.email else ''
    })
    emailRow.add(email)
    s5.add(emailRow)
    data.push(s5)

    s6 = Ti.UI.createTableViewSection()
    initialContactRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: 'horizontal',
      selectionSytle: 'none'
    })
    initContactLabel = Ti.UI.createLabel({
      text: 'Initial Contact',
      font: {fontWeight: 'bold', fontSize: 16},
      height: 45,
      width: 160,
      left: 10
    })
    sep5 = Ti.UI.createView({
      width: 1,
      height: 45,
      left: 0,
      backgroundColor: '#cccccc'
    })
    # TODO : Change to a picker
    initialPicker = Ti.UI.createTextField({
      height: 45,
      width: 120,
      left: 7,
      keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('1/10/2011'),
      value: if prospect? then date('n/j/Y', prospect.firstContactDate) else date('n/j/Y')
    })
    initialContactRow.add(initContactLabel)
    initialContactRow.add(sep5)
    initialContactRow.add(initialPicker)
    s6.add(initialContactRow)
    pocRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: 'horizontal',
      selectionSytle: 'none'
    })
    pocTextfield = Ti.UI.createTextField({
      width: 280,
      height: 40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Point of Contact'),
      value: if prospect? then prospect.firstContactPoint else ''
    })
    pocRow.add(pocTextfield)
    s6.add(pocRow)
    data.push(s6)
    
    s7 = Ti.UI.createTableViewSection()
    prevSavedRow = Ti.UI.createTableViewRow({
      title: 'Previously Saved',
      hasCheck: if prospect? then prospect.previouslySaved else false
    })
    prevBaptRow = Ti.UI.createTableViewRow({
      title: 'Previously Baptized',
      hasCheck: if prospect? then prospect.previouslyBaptized else false
    })
    attendedRow = Ti.UI.createTableViewRow({
      title: 'Attended Church',
      hasCheck: if prospect? then prospect.attended else false
    })
    enrolledRow = Ti.UI.createTableViewRow({
      title: 'Enrolled in Sunday School',
      hasCheck: if prospect? then prospect.sundaySchool else false
    })
    s7.add(prevSavedRow)
    s7.add(prevBaptRow)
    s7.add(attendedRow)
    s7.add(enrolledRow)
    s7.addEventListener('click', (e) ->
      if e.row.hasCheck then e.row.hasCheck = false else e.row.hasCheck = true
    )
    data.push(s7)
    
    if @platform is 'iPhone OS'
      b = Ti.UI.createButton({
        systemButton:Ti.UI.iPhone.SystemButton.SAVE
      })
      b.addEventListener('click', () ->
        # Validation code
        emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if email.value isnt '' and not email.value.match(emailPattern)
          alert('Invalid email address.')
          return false
        datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/
        if initialPicker.value isnt '' and not initialPicker.value.match(datePattern)
          alert('Invalid date format. Please format date MM/DD/YYYY')
          return false
        
        if prospect?
          # Update the existing prospect
          #alert(prevSavedRow.hasCheck)
          shl.Prospect.update(prospect.id,{
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
            previouslySaved: if prevSavedRow.hasCheck then "1" else "0",
            previouslyBaptized: if prevBaptRow.hasCheck then "1" else "0",
            attended: if attendedRow.hasCheck then "1" else "0",
            sundaySchool: if enrolledRow.hasCheck then "1" else "0"
          })
          win.exitValue = true
          win.close()
        else
          # Create an object to save to the database
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
            previouslySaved: if prevSavedRow.hasCheck then "1" else "0",
            previouslyBaptized: if prevBaptRow.hasCheck then "1" else "0",
            attended: if attendedRow.hasCheck then "1" else "0",
            sundaySchool: if enrolledRow.hasCheck then "1" else "0"
          })
          Ti.API.info(createdProspect.toJSON())
          # Clear all values
          fname.value = ''
          fname.blur()
          sname.value = ''
          sname.blur()
          lname.value = ''
          lname.blur()
          street.value = ''
          street.blur()
          city.value = ''
          city.blur()
          state.value = ''
          state.blur()
          zip.value = ''
          zip.blur()
          country.value = ''
          country.blur()
          homeText.value = ''
          homeText.blur()
          mobileText.value = ''
          mobileText.blur()
          email.value = ''
          email.blur()
          initialPicker.value = date('n/j/Y')
          initialPicker.blur()
          pocTextfield.value = ''
          pocTextfield.blur()
          tableView.scrollToTop()
          prevSavedRow.hasCheck = false
          prevBaptRow.hasCheck = false
          attendedRow.hasCheck = false
          enrolledRow.hasCheck = false
          # TODO : open modal window that shows the prospect
          viewProspectWin = self.createProspectViewWindow(createdProspect)
          closeButton = Ti.UI.createButton({
            systemButton:Ti.UI.iPhone.SystemButton.DONE
          })
          closeButton.addEventListener('click', (e) ->
            viewProspectWin.close()
          )
          viewProspectWin.setRightNavButton(closeButton)
          self.tabs.activeTab.open(viewProspectWin)
      )
      win.setRightNavButton(b)
      if prospect?
        cancel = Ti.UI.createButton({
          systemButton:Ti.UI.iPhone.SystemButton.CANCEL
        })
        cancel.addEventListener('click', (e) ->
          win.exitValue = false
          win.close()
        )
        win.setLeftNavButton(cancel)
    # Finally Make the TableView and add
    tableView = Ti.UI.createTableView({
      data: data,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    })
    # Add delete button if editing prospect
    if prospect?
      deleteProspectView = Ti.UI.createView({
        width: 300,
        height: 57,
        layout: 'vertical'
      })
      deleteProspectButton = Ti.UI.createButton({
        width: 300,
        height: 57,
        left: 0,
        title: 'Delete',
        color: '#fff',
        font: {fontWeight:'bold', fontSize: 22},
        backgroundImage: '/images/button_red.png'
      })
      deleteProspectButton.addEventListener('click', (e) ->
        options = {
          options: ['Delete Prospect', 'Mark as Dead End', 'Cancel'],
          destructive: 0,
          cancel: 2,
          title: 'Are you really sure?'
        }
        deleteProspectDialog = Ti.UI.createOptionDialog(options)
        deleteProspectDialog.addEventListener('click', (f) ->
          if f.index is 0
            # delete prospect
            prospect.destroy()
            win.deleteProspect = true
            win.exitValue = false
            win.close()
          else if f.index is 1
            # change prospect status to dead end
            prospect.updateAttribute('status', 'Dead End')
            win.exitValue = true
            win.close()
        )
        deleteProspectDialog.show()
      )
      deleteProspectView.add(deleteProspectButton)
      tableView.footerView = deleteProspectView
    
    win.add(tableView)
    return win
  
shl.ui = new UI