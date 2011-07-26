# Contains all the UI functions associated with the Starred Window Tab.
class StarredTab
  constructor: () ->
    @win = @createStarredWindow()
    @tab = Ti.UI.createTab({
      title: 'Starred',
      window: @win,
      icon: 'images/28-star.png'
    })
  
  createStarredWindow : () ->
    win = Ti.UI.createWindow({
      title: 'Starred'
    })
    starList = shl.List.find(1)
    prospects = starList.getProspectList()
    Ti.API.info('prospects = ' + prospects)
    tableView = shl.ui.createProspectTableView(prospects)
    win.addEventListener('click', (e) ->
      dataSourceString = e.source + ''
      if dataSourceString.indexOf('TiUIImageView') isnt -1
        win.fireEvent('focus')
        return true
    )
    win.add(tableView)
    win.addEventListener('focus', (e) ->
      prospects = starList.getProspectList()
      tableView.updateProspects(prospects)
    )
    return win
  
shl.starredTab = new StarredTab