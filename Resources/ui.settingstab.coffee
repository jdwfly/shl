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
    
    defaultSection = Ti.UI.createTableViewSection({
      headerTitle: 'Default Settings'
    })
    defaultCityRow = new SettingRow({},{
      name: 'defaultCity',
      control: 'text',
      value: Ti.App.Properties.getString('defaultCity', ' '),
      title: 'City'
    })
    defaultStateRow = new SettingRow({},{
      name: 'defaultState',
      control: 'text',
      value: Ti.App.Properties.getString('defaultState', ' '),
      title: 'State'
    })
    defaultZipRow = new SettingRow({},{
      name: 'defaultZip',
      control: 'text',
      value: Ti.App.Properties.getString('defaultZip', ' '),
      title: 'Zip'
    })
    defaultCountryRow = new SettingRow({},{
      name: 'defaultCountry',
      control: 'text',
      value: Ti.App.Properties.getString('defaultCountry', ' '),
      title: 'Country'
    })
    defaultSection.add(defaultCityRow)
    defaultSection.add(defaultStateRow)
    defaultSection.add(defaultZipRow)
    defaultSection.add(defaultCountryRow)
    
    data.push(defaultSection)
    
    tableView = Ti.UI.createTableView({
      data: data,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    })
    settingsWin.add(tableView)
    
    return settingsWin
    
shl.settingsTab = new SettingsTab