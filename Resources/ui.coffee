# All User Interface stuff is going into this class
class UI
  constructor : () ->
    @isAndroid = if Ti.Platform.name is 'android' then true else false
    @platform = Ti.Platform.name
    @tabs = @createApplicationTabGroup()
  
  createApplicationTabGroup : () ->
    tabs = Ti.UI.createTabGroup()
    
    # Create main windows
    lists = @createListsWindow()
    starred = @createStarredWindow()
    add = @createAddWindow()
    search = @createSearchWindow()
    nearby = @createNearbyWindow()
    settings = @createSettingsWindow()
    help = @createHelpWindow()
    
    # Create main tabs
    listsTab = Ti.UI.createTab({
      title: 'Lists',
      window: lists,
      icon: 'images/179-notepad.png'
    })
    starredTab = Ti.UI.createTab({
      title: 'Starred',
      window: starred,
      icon: 'images/28-star.png'
    })
    addTab = Ti.UI.createTab({
      title: 'Add',
      window: add,
      icon: 'images/13-plus.png'
    })
    searchTab = Ti.UI.createTab({
      title: 'Search',
      window: search,
      icon: 'images/06-magnify.png'
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
    #tabs.addTab(nearbyTab)
    #tabs.addTab(settingsTab)
    #tabs.addTab(helpTab)
    tabs.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT})
    
    return tabs
  
  createListsWindow : () ->
    self = this
    win = Ti.UI.createWindow({
      title: 'Lists'
      activity: {
        onCreateOptionsMenu : (e) ->
          menu = e.menu
          m1 = menu.add({title: 'Add Prospect'})
          m2 = menu.add({title: 'Add List'})
          m1.addEventListener('click', (e) ->
            # TODO: call add prospect window
            alert('clicked')
          )
          m2.addEventListener('click', (e) ->
            # TODO: call add list window
            alert('clicked')
          )
      }
    })
    # TODO: call the function to get all Lists
    lists = shl.List.find({
      where: {active: 1},
      order: 'weight ASC'
    })
    Ti.API.info('lists = ' + lists.toJSON())
    tableView = @createListTableView(lists)
    win.add(tableView)
    
    if @platform is 'iPhone OS'
      edit = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.EDIT
      })
      edit.addEventListener('click', (e) ->
        win.setRightNavButton(cancel)
        allLists = shl.List.find({
          order: 'weight ASC'
        })
        tableView.updateLists(allLists)
        tableView.editing = true
      )
      cancel = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.DONE,
        title: 'Done'
      })
      cancel.addEventListener('click', (e) ->
        win.setRightNavButton(edit)
        tableView.editing = false
        lists = shl.List.find({
          where: {active: 1},
          order: 'weight ASC'
        })
        tableView.updateLists(lists)
      )
      # win.setRightNavButton(edit)
    win.addEventListener('open', (e) ->
      win.addEventListener('focus', (e) ->
        lists = shl.List.find({
          where: {active: 1},
          order: 'weight ASC'
        })
        tableView.updateLists(lists)
      )
    )
    
    return win
  
  createStarredWindow : () ->
    win = Ti.UI.createWindow({
      title: 'Starred'
    })
    prospects = shl.Prospect.find({
      where: {starred: 1},
      order: 'id ASC'
    })
    Ti.API.info('prospects = ' + prospects.toJSON())
    win.add(@createProspectTableView(prospects))
    
    return win
  
  createAddWindow : () ->
    if @isAndroid
      win = Ti.UI.createWindow({
        title: 'Add Prospect'
      })
      webView = Ti.UI.createWebView({
        url: 'addProspect.html'
      })
      Ti.App.addEventListener('webToTi', (e) ->
        Ti.API.info('webToTi Sent: ' + JSON.stringify(e))
      )
      win.add(webView)
      return win
    win = @createProspectFormWin()
    return win
  
  createSearchWindow : () ->
    self = this
    win = Ti.UI.createWindow({
      title: 'Search'
    })
    search = Titanium.UI.createSearchBar({
      barColor:'#000',
      backgroundColor: '#000',
      showCancel:true,
      height:43,
      top:0
    })
    win.add(search)
    search.addEventListener('cancel', (e) ->
      search.blur()
    )
    search.addEventListener('return', (e) ->
      search.blur()
    )       
    result = @createProspectTableView([])
    result.height = 280
    win.add(result)
    search.addEventListener('return', (e) ->
      prospects = shl.Prospect.search(e.value)
      result.updateProspects(prospects)
    )
    return win
  
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
  createListTableView : (lists) ->
    self = this
    data = @processListData(lists)
    tableView = Ti.UI.createTableView({
      data:data,
      moveable: true
    })
    tableView.addEventListener('click', (e) ->
      Ti.API.info(JSON.stringify(e.row))
      if e.row.listID == 'custom'
        # TODO : pull up modal window to add a list
        addW = Ti.UI.createWindow({
          title:'New Custom List',
          backgroundColor: '#BBBBBB'
        })
        lname = Ti.UI.createTextField({
          height:40,
          width: 300,
          top: 10,
          backgroundColor: '#ffffff'
          keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
          returnKeyType:Titanium.UI.RETURNKEY_DONE,
          borderStyle:Titanium.UI.INPUT_BORDERSTYLE_BEZEL,
          hintText:L('List Name')
        })
        addW.add(lname)
        b = Ti.UI.createButton({
          width: 300,
          height: 57,
          top: 60,
          title: 'Save',
          color: '#fff',
          backgroundImage: '/images/button_blue.png'
        })
        b.addEventListener('click', () ->
          # Create an object to save to the database
          createdList = shl.List.create({
            name: lname.value,
            weight: 0,
            active: 1
          })
          # TODO : show a list of prospects to add to the list
          addW.close()
        )
        #addW.setRightNavButton(b)
        addW.add(b)
        c = Ti.UI.createButton({
          width: 300,
          height: 57,
          top: 125,
          title: 'Cancel',
          color: '#fff',
          backgroundImage: '/images/button_blue.png'
        })
        c.addEventListener('click', () ->
          addW.close()
        )
        addW.add(c)
        addW.open({
          modal:true,
          modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
          modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        })
        return true
      if e.row.listID == 'more'
        allLists = shl.List.find({
          order: 'weight ASC'
        })
        tableView.updateLists(allLists)
        index = tableView.getIndexByName('more');
        tableView.deleteRow(index)
        newRow = Ti.UI.createTableViewRow({
          height: 'auto',
          title: 'Hide Extra Lists',
          listID: 'less',
          editable: false,
          moveable: false,
          name: 'less'
        })
        tableView.appendRow(newRow)
        return true
      if e.row.listID == 'less'
        allLists = shl.List.find({
          where: {active: 1},
          order: 'weight ASC'
        })
        tableView.updateLists(allLists)
        return true
      # TODO : create and populate window based on list choice
      # Determine if the list is an auto list
      listWin = Ti.UI.createWindow()
      listWin.addEventListener('open', (f) ->
        listWin.addEventListener('focus', (g) ->
          if query?
            prospects = shl.Prospect.find(query)
          else
            currentList = shl.List.find(e.row.listID)
            prospects = currentList.getProspectList()
            listWin.setRightNavButton(listedit)
            listview.editing = false
          data = self.processProspectData(prospects)
          listview.setData(data)
        )
      )
      if shl.aLists[e.row.title]?
        listWin.title = e.row.title
        query = shl.aLists[e.row.title].query
        prospects = shl.Prospect.find(shl.aLists[e.row.title].query)
        Ti.API.info('prospects = ' + prospects.toJSON())
        listview = self.createProspectTableView(prospects)
        listWin.add(listview)
        self.tabs.activeTab.open(listWin)
      else
        listWin.title = e.row.title
        currentList = shl.List.find(e.row.listID)
        
        Ti.API.info('currentList = ' + currentList.toJSON())
        Ti.API.info('currentList = ' + JSON.stringify(ActiveRecord))
        prospects = currentList.getProspectList()
        Ti.API.info('prospects = ' + JSON.stringify(prospects))
        listview = self.createProspectTableView(prospects)
        listview.deleteButtonTitle = 'Remove'
        listview.editable = true
        listview.allowsSelectionDuringEditing = true
        listview.addEventListener('delete',(e) ->
          currentListing = shl.Listing.find({
            first : true,
            where: {
              list_id : currentList.id,
              prospect_id : e.row.prospect.id
            }
          })
          currentListing.destroy()
        )
        
        listWin.add(listview)
        listedit = Titanium.UI.createButton({
          title:'Edit'
        })
        listedit.addEventListener('click', () ->
          listWin.setRightNavButton(listcancel)
          listview.editing = true
          brow = Ti.UI.createTableViewRow({
            backgroundColor : '#999',
            height : 50,
            editable : false,
            name : 'options'
          })
          editBtns = Ti.UI.createView({
            height : 50,
            width : 300,
            layout : 'horizontal'
          })
          addBtn = Ti.UI.createButton({
            title : 'Add',
            width : 88,
            height : 38,
            left : 9,
            top : 6
          })
          addBtn.addEventListener('click', () ->
            addProspectsWin = self.createAddProspectsWindow(e.row.listID)
            addProspectsWin.open({
              modal:true,
              modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
              modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
            })
          )
          clearBtn = Ti.UI.createButton({
            title : 'Clear',
            width : 88,
            height : 38,
            left : 9,
            top : 6
          })
          clearBtn.addEventListener('click', () ->
            a = Titanium.UI.createAlertDialog({
              title:'Clear list?',
              buttonNames : ['OK','Cancel'],
              cancel : 1
            })
            a.addEventListener('click', (g) ->
              Ti.API.info(e.index)
              if g.index == 0
                listings = currentList.getListingList()
                for listing in listings
                  listing.destroy()
                currentList = shl.List.find(e.row.listID)
                prospects = currentList.getProspectList()
                listWin.setRightNavButton(listedit)
                listview.editing = false
                data = self.processProspectData(prospects)
                listview.setData(data)
            )
            a.show()
          )
          deleteBtn = Ti.UI.createButton({
            title : 'Delete',
            width : 88,
            height : 38,
            left : 9,
            top : 6
          })
          deleteBtn.addEventListener('click', (g)->
            a = Titanium.UI.createAlertDialog({
              title:'Delete list?',
              buttonNames : ['OK','Cancel'],
              cancel : 1
            })
            a.addEventListener('click', (g) ->
              Ti.API.info(e.index)
              if g.index == 0
                listings = currentList.getListingList()
                for listing in listings
                  listing.destroy()
                currentList.destroy()
                listWin.close()
            )
            a.show()
          )
          editBtns.add(addBtn)
          editBtns.add(clearBtn)
          editBtns.add(deleteBtn)
          brow.add(editBtns)
          if listview.data[0] and listview.data[0].rows.length >= 1
            listview.insertRowBefore(0,brow)
          else
            listview.appendRow(brow)
        )

        listcancel = Titanium.UI.createButton({
          title:'Done',
          style:Titanium.UI.iPhone.SystemButtonStyle.DONE
        })
        listcancel.addEventListener('click', () ->
          listWin.setRightNavButton(listedit)
          listview.editing = false
          index = listview.getIndexByName('options');
          listview.deleteRow(index,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.UP})
        )
        listWin.setRightNavButton(listedit)
        
        self.tabs.activeTab.open(listWin)
    )
    tableView.addEventListener('move', (e) ->
      Ti.API.info(JSON.stringify(e.index))
      list = shl.List.find(e.row.listID)
      list.set('weight', e.index)
      Ti.API.info(list.toJSON())
    )
    tableView.addEventListener('delete', (e) ->
      alert(JSON.stringify(e.row))
    )
    tableView.updateLists = (lists) ->
      data = self.processListData(lists)
      @setData(data)
    
    return tableView
  
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
    data = []
    
    if @platform is 'iPhone OS'
      editButton = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.EDIT
      })
      editButton.addEventListener('click', (e) ->
        # Open modal window to edit prospect
        editWin = self.createProspectFormWin(prospect)
        editWin.addEventListener('close', (e) ->
          # Update the current information on the page
          if e.source.exitValue
            prospect = shl.Prospect.find(prospect.id)
            Ti.API.info(prospect.toJSON())
            nameLabel.text = prospect.formatName()
            contactLabel.text = 'Last Contact: ' + prospect.formatContactPretty()
            if addressSection?
              addressLabel.text = prospect.formatAddress()
            if phoneHomeLabel?
              phoneHomeLabel.text = 'home: ' + prospect.phoneHome
            if phoneMobileLabel?
              phoneMobileLabel.text = 'mobile: ' + prospect.phoneMobile
            if emailLabel?
              emailLabel.text = prospect.email
            firstContactLabel.text = 'First Contact: ' + date('n/j/Y', prospect.firstContactDate) + "\n" + prospect.firstContactPoint
        )
        editWin.open({
          modal:true,
          modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
          modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        })
      )
      win.setRightNavButton(editButton)
    
    headerView = Ti.UI.createView({
      height: '100'
    })
    nameLabel = Ti.UI.createLabel({
      text: prospect.formatName(),
      left: 10,
      top: 7,
      width: 300,
      height: 17,
      color: '#4c596e'
    })
    contactLabel = Ti.UI.createLabel({
      text: 'Last Contact: ' + prospect.formatContactPretty(),
      left: 10,
      top: 21,
      width: 300,
      height: 17,
      font: {fontSize: 12},
      color: '#4c596e'
    })
    recordContactButton = Ti.UI.createButton({
      width: 300,
      height: 57,
      top: 39,
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
          
          Ti.API.info(prospect.getContactList().toJSON())
          contactSection.addContactRows(createdContacts)
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
        keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
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
    headerView.add(recordContactButton)
    
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
      data.push(addressSection)
    
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
      data.push(phoneSection)
      
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
      data.push(emailSection)
    
    firstContactSection = Ti.UI.createTableViewSection()
    firstContactRow = Ti.UI.createTableViewRow({height: 55})
    firstContactLabel = Ti.UI.createLabel({
      text: 'First Contact: ' + date('n/j/Y', prospect.firstContactDate) + "\n" + prospect.firstContactPoint
      left: 10
    })
    firstContactRow.add(firstContactLabel)
    firstContactSection.add(firstContactRow)
    data.push(firstContactSection)
    
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
          else
            statusTableView.data[0].rows[i].hasCheck = false
      )
      statusWin.add(statusTableView)
      statusWin.addEventListener('close', (e) ->
        for row, i in statusTableView.data[0].rows
          if row.hasCheck
            prospect.updateAttribute('status', row.title)
            statusValueLabel.text = row.title
      )
      self.tabs.activeTab.open(statusWin)
    )
    statusRow.add(statusLabel)
    statusRow.add(statusValueLabel)
    statusSection.add(statusRow)
    data.push(statusSection)
    
    contacts = prospect.getContactList()
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
      tableView.deleteRow(tableView.getIndexByName('None'))
    data.push(contactSection)
    
    tableView = Ti.UI.createTableView({
      data: data,
      headerView: headerView,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    })
    win.add(tableView)
    
    return win
  
  processListData : (lists) ->
    data = for i in lists
      row = Ti.UI.createTableViewRow({
        height: 'auto',
        hasChild: true,
        title: i.name,
        listID: i.id,
        editable: false,
        moveable: true
      })
    addCustom = Ti.UI.createTableViewRow({
      height: 'auto',
      title: 'Create Custom List...',
      listID: 'custom',
      editable: false,
      moveable: false
    })
    data.push(addCustom)
    viewMore = Ti.UI.createTableViewRow({
      height: 'auto',
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
      row = Ti.UI.createTableViewRow()
      return [row]
    data = for prospect in prospects
      row = Ti.UI.createTableViewRow({
        height: 'auto',
        hasDetail: true,
        selectedBackgroundColor: '#ffffff'
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
      starImage = Ti.UI.createImageView({
        url: 'images/star-off.png',
        width: 30,
        height: 30,
        left: 0,
        top: 5
      })
      starImage.addEventListener('click', (e) ->
        if @url is 'images/star-off.png'
          @url = 'images/star-on.png'
        else
          @url = 'images/star-off.png'
      )
      row.add(nextstepLabel)
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
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('First Name Male'),
      value: if prospect? then prospect.firstMale else ''
    })
    fnameRow.add(fname)
    s1.add(fnameRow)
    # Second Name Field
    snameRow = Ti.UI.createTableViewRow({
      height: 40,
      layout: "vertical",
      selectionStyle: "none"
    })
    sname = Ti.UI.createTextField({
      height: 40,
      left: 10,
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('First Name Female'),
      value: if prospect? then prospect.firstFemale else ''
    })
    snameRow.add(sname)
    s1.add(snameRow)
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
    
    data.push(s1)
    ###
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
    ###
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
    sep1 = Ti.UI.createView({
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
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('Zip'),
      value: if prospect? then prospect.zip else ''
    })
    sep2 = Ti.UI.createView({
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
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
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
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
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
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
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
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
      returnKeyType:Titanium.UI.RETURNKEY_DONE,
      borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText:L('1/10/2011'),
      value: if prospect? then date('n/j/Y', prospect.firstContactDate) else ''
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
        if prospect?
          # Update the existing prospect
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
            previouslySaved: prevSavedRow.hasCheck,
            previouslyBaptized: prevBaptRow.hasCheck,
            attended: attendedRow.hasCheck,
            sundaySchool: enrolledRow.hasCheck
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
            previouslySaved: prevSavedRow.hasCheck,
            previouslyBaptized: prevBaptRow.hasCheck,
            attended: attendedRow.hasCheck,
            sundaySchool: enrolledRow.hasCheck
          })
          Ti.API.info(createdProspect.toJSON())
          # Clear all values
          fname.value = ''
          sname.value = ''
          lname.value = ''
          street.value = ''
          city.value = ''
          state.value = ''
          zip.value = ''
          country.value = ''
          homeText.value = ''
          mobileText.value = ''
          email.value = ''
          initialPicker.value = ''
          pocTextfield.value = ''
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
    win.add(tableView)
    return win
  
shl.ui = new UI