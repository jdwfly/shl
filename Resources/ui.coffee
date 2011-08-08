# All User Interface stuff is going into this class
class UI
  constructor : () ->
    @isAndroid = if Ti.Platform.name is 'android' then true else false
    @platform = Ti.Platform.name
    #@tabs = @createApplicationTabGroup()
  
  createApplicationTabGroup : () ->
    tabs = Ti.UI.createTabGroup()
    
    # Create main tabs
    listsTab = shl.listsTab.tab
    starredTab = shl.starredTab.tab
    addTab = shl.addTab.tab
    searchTab = shl.searchTab.tab
    statsTab = shl.statsTab.tab
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
  
  createProspectTableView : (prospects) ->
    self = this
    data = @processProspectData(prospects)
    tableView = Ti.UI.createTableView({
      data:data
    })
    tableView.addEventListener('click', (e) ->
      # don't do anything if the star was clicked
      dataSourceString = e.source + ''
      if self.isAndroid
        if dataSourceString.indexOf('Ti.UI.ImageView') isnt -1.0
          return true
      else
        if dataSourceString.indexOf('TiUIImageView') isnt -1
          return true
      if not tableView.editing
        Ti.API.info(JSON.stringify(e.row))
        # Don't open a window if there is no prospect in the row
        if !e.row.prospect?
          return false
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
    tableView.addEventListener('delete', (e) ->
      Ti.API.info(e.row.contactID)
      d = shl.Contact.find(e.row.contactID)
      d.destroy()
    )
    tableView.updateProspect = (prospect) ->
      data = self.processProspectViewData(prospect)
      @setData(data.data)
      @headerView = data.headerView
    
    editButtonListener = (e) ->
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
      if self.isAndroid
        self.tabs.activeTab.open(editWin)
      else
        editWin.open({
          modal:true,
          modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
          modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        })
    
    if @platform is 'iPhone OS'
      editButton = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.EDIT
      })
      editButton.addEventListener('click', editButtonListener)
      win.setRightNavButton(editButton)
    
    win.addEventListener('open', (e) ->
      win.addEventListener('focus', (f) ->
        updateProspect = shl.Prospect.find(prospect.id)
        tableView.updateProspect(updateProspect)
      )
    )
    win.activity = {
      onCreateOptionsMenu : (e) ->
        menu = e.menu
        m1 = menu.add({title: 'Edit'})
        m1.addEventListener('click', editButtonListener)
    }
    
    win.add(tableView)
    return win
    
  processProspectViewData : (prospect) ->
    self = this
    data = {}
    # Sometimes prospect will be undefined so exit
    if !prospect.id?
      return {}
    prospect = shl.Prospect.find(prospect.id)
    
    headerView = Ti.UI.createView({
      height: '116'
    })
    nameLabel = Ti.UI.createLabel({
      text: prospect.formatName?(),
      left: 10,
      top: 7,
      width: 300,
      height: 24,
      color: '#4c596e',
      font: {fontSize: 20}
    })
    contactLabel = Ti.UI.createLabel({
      text: 'Last Contact: ' + prospect.formatContactPretty?(),
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
    if @isAndroid
      nameLabel.color = '#bdbebd'
      contactLabel.color = '#bdbebd'
      contactLabel.top = 29
      nextStepLabel.top = 43
      nextStepLabel.color = '#bdbebd'
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
        headerTitle: prospect.formatName?()
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
          headerTitle: prospect.formatName?()
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
    
    if prospect.formatAddress?() isnt ''
      addressSection = Ti.UI.createTableViewSection()
      addressRow = Ti.UI.createTableViewRow({height: 75})
      addressLabel = Ti.UI.createLabel({
        text: prospect.formatAddress?()
        left: 10
      })
      addressRow.add(addressLabel)
      addressSection.add(addressRow)
      addressSection.addEventListener('click', (e) ->
        query = prospect.formatAddressGoogle?()
        query = query.replace /[ ]/gi, "+"
        Ti.API.info(query)
        Ti.Platform.openURL("http://maps.google.com/maps?q="+query)
      )
      data.data.push(addressSection)
    
    if prospect.phoneHome isnt '' or prospect.phoneMobile isnt ''
      phoneSection = Ti.UI.createTableViewSection()
      if prospect.phoneHome isnt ''
        phoneHomeRow = Ti.UI.createTableViewRow()
        phoneHomeLabel = Ti.UI.createLabel({
          text: 'home: ' + formatPhone(prospect.phoneHome),
          phone: prospect.phoneHome,
          left: 10
        })
        phoneHomeRow.add(phoneHomeLabel)
        phoneSection.add(phoneHomeRow)
      if prospect.phoneMobile isnt ''
        phoneMobileRow = Ti.UI.createTableViewRow()
        phoneMobileLabel = Ti.UI.createLabel({
          text: 'mobile: ' + formatPhone(prospect.phoneMobile),
          phone: prospect.phoneMobile,
          left: 10
        })
        phoneMobileRow.add(phoneMobileLabel)
        phoneSection.add(phoneMobileRow)
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
          height: 'auto',
          editable: 'true'
        })
        rowLabel = Ti.UI.createLabel({
          text: date('n/j/Y', contact.date) + " " + contact.type + ": " + contact.comments,
          width: 280,
          left: 10
        })
        row.contactID = contact.id
        row.add(rowLabel)
        contactSection.add(row)
    data.data.push(contactSection)
    
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
        searchTerm: prospect.formatName?() + ' ' + prospect.formatAddress?()
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
        text: prospect.formatName?(),
        font: {fontWeight: 'bold', fontSize:18},
        height: 'auto',
        width: 'auto',
        left: 5
      })
      lastContactLabel = Ti.UI.createLabel({
        text: 'Last Contact: ' + prospect.formatContactPretty?(),
        font: {fontWeight: 'normal', fontSize: 12},
        height: 'auto',
        width: 'auto',
        left: 5
      })
      addressLabel = Ti.UI.createLabel({
        text: prospect.formatAddress?(),
        font: {fontWeight: 'normal', fontSize: 12},
        height: 'auto',
        width: 'auto',
        left: 5
      })
      starImage = Ti.UI.createImageView({
        backgroundImage: if prospect.isStarred?() then 'images/star-on.png' else 'images/star-off.png',
        width: 30,
        height: 30,
        left: 0,
        top: 5,
        prospectID: prospect.id
      })
      starImage.addEventListener('click', (e) ->
        currentProspect = shl.Prospect.find(starImage.prospectID)
        if not currentProspect.isStarred?()
          @backgroundImage = 'images/star-on.png'
          starList = shl.List.find(1)
          starList.createListing({
            prospect_id: @prospectID
          })
        else
          @backgroundImage = 'images/star-off.png'
          z = shl.Listing.find({
            first: true,
            where: {
              list_id: 1,
              prospect_id: @prospectID
            }
          })
          z.destroy()
      )
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
      width: 280,
      top:0,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:'First Name Male',
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
    sname = Ti.UI.createTextField({
      height: 40,
      width: 280,
      top: -40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText: 'First Name Female',
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
      width: 280,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText: 'Last Name',
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
    else if @isAndroid
      fnameRow.height = 80
      sname.top = 0
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
    
    s3 = Ti.UI.createTableViewSection()
    streetRow = Ti.UI.createTableViewRow({
      height: 45,
      layout: "vertical",
      selectionStyle: "none"
    })
    street = Ti.UI.createTextField({
      height:40,
      width: 280,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText: 'Street',
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
      hintText: 'City',
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
      hintText: 'State',
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
      hintText: 'Zip',
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
      hintText: 'Country',
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
      hintText: 'Email',
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
      height: 40,
      width: 120,
      left: 7,
      keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText: '1/10/2011',
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
      hintText: 'Point of Contact',
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
      # Stop the event bubbling for Android
      if !self.isAndroid
        if e.row.hasCheck then e.row.hasCheck = false else e.row.hasCheck = true
    )
    # Android will only fire the click event if it is on the rows not the section
    if @isAndroid
      prevSavedRow.addEventListener('click', (e) ->
        if e.row.hasCheck then e.row.hasCheck = false else e.row.hasCheck = true
      )
      prevBaptRow.addEventListener('click', (e) ->
        if e.row.hasCheck then e.row.hasCheck = false else e.row.hasCheck = true
      )
      attendedRow.addEventListener('click', (e) ->
        if e.row.hasCheck then e.row.hasCheck = false else e.row.hasCheck = true
      )
      enrolledRow.addEventListener('click', (e) ->
        if e.row.hasCheck then e.row.hasCheck = false else e.row.hasCheck = true
      )
    data.push(s7)
    
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
        tableView.scrollToTop(0)
        prevSavedRow.hasCheck = false
        prevBaptRow.hasCheck = false
        attendedRow.hasCheck = false
        enrolledRow.hasCheck = false
        # TODO : open modal window that shows the prospect
        viewProspectWin = self.createProspectViewWindow(createdProspect)
        if self.isAndroid
          # TODO needs a different button
          Ti.API.info('todo')
        else
          viewProspectWin.setRightNavButton()
        self.tabs.activeTab.open(viewProspectWin)
    )
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
    if @isAndroid
      tableView.backgroundColor = '#181818'
      b.height = 40
      b.width = 300
      b.title = 'Save Prospect'
      tableView.footerView = b
    else
      win.setRightNavButton(b)
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
            if prospect.isStarred?()
              z = shl.Listing.find({
                first: true,
                where: {
                  list_id: 1,
                  prospect_id: prospect.id
                }
              })
              z.destroy()
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