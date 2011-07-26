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
    # TODO: Biggest priority for android is this form
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
    win = shl.ui.createProspectFormWin()
    return win
  
shl.addTab = new AddTab