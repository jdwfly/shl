# Contains all the UI functions associated with the Add Tab.
class AddTab
  constructor: () ->
    @win = @createAddWindow()
    @tab = Ti.UI.createTab({
      title: 'Add',
      window: @win,
      icon: 'images/13-plus.png'
    })
  
  createAddWindow : () ->
    win = shl.ui.createProspectFormWin()
    return win
  
shl.addTab = new AddTab