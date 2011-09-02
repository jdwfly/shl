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
    testRow = SettingRow({},{
      name: 'testRow',
      control: 'boolean',
      value: Ti.App.Properties.getBool('testRow'),
      title: 'Test Row',
      debug: true
    })
    data.push(testRow)
    
    testRowText = SettingRow({},{
      name: 'testRowText',
      control: 'text',
      value: Ti.App.Properties.getString('testRowText'),
      title: 'Test Row Text',
      debug: true
    })
    data.push(testRowText)
    
    tableView = Ti.UI.createTableView({
      data: data
    })
    settingsWin.add(tableView)
    
    return settingsWin
    
shl.settingsTab = new SettingsTab