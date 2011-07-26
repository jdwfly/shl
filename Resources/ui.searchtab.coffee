# Contains all the UI functions associated with the Search Tab.
class SearchTab
  constructor : () ->
    @win = @createSearchWindow()
    @tab = Ti.UI.createTab({
      title: 'Search',
      window: @win,
      icon: 'images/06-magnify.png'
    })
  
  createSearchWindow : () ->
    self = this
    win = Ti.UI.createWindow({
      title: 'Search'
    })
    search = Titanium.UI.createSearchBar({
      barColor:'#385292',
      showCancel:false,
      hintText:'search'
    })
    search.addEventListener('change', (e) ->
      e.value
    )
    search.addEventListener('return', (e) ->
      search.blur();
    )
    search.addEventListener('cancel', (e) ->
      search.blur()
    )
    
    tableView = shl.ui.createProspectTableView(shl.Prospect.find())
    tableView.search = search
    tableView.searchHidden = false
    tableView.filterAttribute = 'searchTerm'    
    win.addEventListener('focus', (g) ->
      data = shl.ui.processProspectData(shl.Prospect.find())
      tableView.setData(data)
    )
    
    win.add(tableView)
    return win
  
shl.searchTab = new SearchTab