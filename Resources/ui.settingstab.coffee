SettingRow = require('lib/utility').SettingRow
# Contains all the UI functions associated with the Settings Tab
class SettingsTab
  constructor : () ->
    @win = @createSettingsWindow()
    @tab = Ti.UI.createTab({
      title: 'Settings',
      window: @win,
      icon: 'images/20-gear2.png'
    })
  
  createSettingsWindow : () ->
    self = this
    settingsWin = Ti.UI.createWindow({
      title: 'Settings'
    })
    data = []
    
    
    
    tableView = Ti.UI.createTableView({
      data: data
    })
    settingsWin.add(tableView)
    
    return settingsWin
    
shl.settingsTab = new SettingsTab