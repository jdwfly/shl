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
      window: starred
    })
    addTab = Ti.UI.createTab({
      title: 'Add',
      window: add
    })
    searchTab = Ti.UI.createTab({
      title: 'Search',
      window: search      
    })
    nearbyTab = Ti.UI.createTab({
      title: 'Nearby',
      window: nearby
    })
    settingsTab = Ti.UI.createTab({
      title: 'Settings',
      window: settings
    })
    helpTab = Ti.UI.createTab({
      title: 'Help',
      window: help
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
    win = Ti.UI.createWindow({
      title: 'All'
      activity: {
        onCreateOptionsMenu : (e) ->
          menu = e.menu
          m1 = menu.add({title: 'Add'})
          m1.addEventListener('click', (e) ->
            alert('clicked')
          )
      }
    })
    prospects = shl.db.listAllProspects()
    win.add(@createProspectTableView(prospects))
    
    if @platform is 'iphone'
      b = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.ADD
      })
      b.addEventListener('click', (e) ->
        alert('clicked')
      )
      win.setRightNavButton(b)
    
    return win
    
  createStarredWindow : () ->
    @createListsWindow()
  
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
  
  createProspectTableView : (prospects) ->
    data = for i of prospects
      row = Ti.UI.createTableViewRow({
        height: 'auto',
        hasChild: true
      })
      content = Ti.UI.createView({
        height: 'auto',
        layout: 'vertical',
        left: 10,
        top: 10,
        bottom: 10,
        right: 10
      })
      if prospects[i].firstMale isnt ''
        title = prospects[i].firstMale
        title += ' and ' + prospects[i].firstFemale if prospects[i].firstFemale isnt ''
        title += ' ' + prospects[i].last if prospects[i].last isnt ''
      else if prospects[i].firstFemale isnt ''
        title = _prospects[i].firstFemale
        title += ' ' + prospects[i].last if prospects[i].last isnt ''
      contentTitle = Ti.UI.createLabel({
        text: title,
        font: {fontWeight: 'bold', fontSize:18},
        height: 'auto',
        width: 'auto',
        left: 5
      })
      # TODO Probably should be it's own function somewhere
      lastContactPretty = (() ->
        date = new Date(prospects[i].lastContact * 1000)
        diff = (((new Date()).getTime() - date.getTime()) / 1000)
        day_diff = Math.floor(diff / 86400)

        if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
          return ''

        day_diff == 0 && (diff < 60 && "just now" || diff < 120 && "1 minute ago" || diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" || diff < 7200 && "1 hour ago" || diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") || day_diff == 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago"
        )()
      lastContactLabel = Ti.UI.createLabel({
        text: 'Last Contact: ' + lastContactPretty,
        font: {fontWeight: 'normal', fontSize: 12},
        height: 'auto',
        width: 'auto',
        left: 5
      })
      address = '' + (if prospects[i].street? and prospects[i].street isnt '' then prospects[i].street else '') +
                (if prospects[i].city? and prospects[i].city isnt '' then "\n" + prospects[i].city else '') +
                (if prospects[i].state? and prospects[i].state isnt '' then ", " + prospects[i].state else '') +
                (if prospects[i].zip? and prospects[i].zip isnt '' then " " + prospects[i].zip else '')
      addressLabel = Ti.UI.createLabel({
        text: address,
        font: {fontWeight: 'normal', fontSize: 12},
        height: 'auto',
        width: 'auto',
        left: 5
      })
      content.add(contentTitle)
      content.add(lastContactLabel)
      content.add(addressLabel)
      row.add(content)
      row
    tableView = Ti.UI.createTableView({data:data})
    tableView.addEventListener('click', (e) -> 
      alert('haha! you thought this would do something didnt you!')
    )
    return tableView
      
shl.ui = new UI