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
    
    # Add tabs to the tabgroup
    tabs.addTab(listsTab)
    tabs.addTab(starredTab)
    tabs.addTab(addTab)
    tabs.addTab(searchTab)
    tabs.addTab(nearbyTab)
    tabs.addTab(settingsTab)
    tabs.addTab(helpTab)
    tabs.open()
    
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
    });
    Ti.API.info('lists = ' + lists.toJSON());
    tableView = @createListTableView(lists)
    win.add(tableView)
    
    if @platform is 'iPhone OS'
      edit = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.EDIT
      })
      edit.addEventListener('click', (e) ->
        win.setRightNavButton(cancel)
        tableView.editing = true
      )
      cancel = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.DONE,
        title: 'Cancel'
      })
      cancel.addEventListener('click', (e) ->
        win.setRightNavButton(edit)
        tableView.editing = false
      )
      win.setRightNavButton(edit)
    
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
    @createListsWindow()
  
  createSearchWindow : () ->
    @createListsWindow()
    
  createNearbyWindow : () ->
    @createListsWindow()
  
  createSettingsWindow : () ->
    @createListsWindow()
    
  createHelpWindow : () ->
    @createListsWindow()
    
  createListTableView : (lists) ->
    self = this
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
    tableView = Ti.UI.createTableView({
      data:data,
      moveable: true
    })
    tableView.addEventListener('click', (e) ->
      Ti.API.info(JSON.stringify(e.row))
      if e.row.listID == 'custom'
        # TODO : pull up modal window to add a list
        alert('add a list')
      # TODO : create and populate window based on list choice
      # Determine if the list is an auto list
      listWin = Ti.UI.createWindow()
      if shl.aLists[e.row.title]?
        listWin.title = e.row.title
        prospects = shl.Prospect.find(shl.aLists[e.row.title].query)
        Ti.API.info('prospects = ' + prospects.toJSON())
        listWin.add(self.createProspectTableView(prospects))
        self.tabs.activeTab.open(listWin)
    )
    tableView.addEventListener('move', (e) ->
      Ti.API.info(JSON.stringify(e.index))
      list = shl.List.find(e.row.listID)
      list.set('weight', e.index)
      Ti.API.info(list.toJSON())
    )
    tableView.addEventListener('delete', (e) ->
      alert(JSON.stringify(e.row));
    )
    
    return tableView
  
  createProspectTableView : (prospects) ->
    self = this
    if prospects.length < 1
      return Ti.UI.createLabel({text: 'None'})
    data = for prospect in prospects
      row = Ti.UI.createTableViewRow({
        height: 'auto',
        hasDetail: true
      })
      content = Ti.UI.createView({
        height: 'auto',
        layout: 'vertical',
        left: 10,
        top: 10,
        bottom: 10,
        right: 10
      })
      if prospect.firstMale isnt ''
        title = prospect.firstMale
        title += ' and ' + prospect.firstFemale if prospect.firstFemale isnt ''
        title += ' ' + prospect.last if prospect.last isnt ''
      else if prospect.firstFemale isnt ''
        title = prospect.firstFemale
        title += ' ' + prospect.last if prospect.last isnt ''
      contentTitle = Ti.UI.createLabel({
        text: title,
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
      content.add(contentTitle)
      content.add(lastContactLabel)
      content.add(addressLabel)
      row.add(content)
      row.prospect = prospect
      row
    tableView = Ti.UI.createTableView({data:data})
    tableView.addEventListener('click', (e) -> 
      Ti.API.info(JSON.stringify(e.row))
      prospectWin = self.createProspectViewWindow(e.row.prospect)
      self.tabs.activeTab.open(prospectWin)
    )
    return tableView
  
  # prospect = loaded prospect model
  # returns a window
  createProspectViewWindow : (prospect) ->
    win = Ti.UI.createWindow()
    testLabel = Ti.UI.createLabel({
      text: prospect.formatName()
    })
    win.add(testLabel)
    
    return win
      
shl.ui = new UI