#Ti.include('lib/utility.js')
#SettingRow = require('lib/utility').SettingRow
# This is a crime to all humanity
class SettingRow
  constructor: (args, settings) ->
    self = this
    instance = Ti.UI.createTableViewRow(args)
    instance.settingName = settings.name
    
    # Just in case we need to debug
    debug = if settings.debug? then settings.debug else false
    
    # add both labels: title and value
    settingTitleLabel = Ti.UI.createLabel({
      text: settings.title,
      left: 5,
      width: 'auto',
      height: 'auto'
    })
    instance.add(settingTitleLabel)
    @settingValueLabel = Ti.UI.createLabel({
      text: settings.value,
      right: if Ti.Platform.osname is 'iphone' then 5 else 30,
      width: 150,
      height: 'auto',
      textAlign: 'right'
    })
    if settings.control isnt 'boolean'
      instance.add(@settingValueLabel)
    # Add the type of control
    switch settings.control
      when 'select', 'text'
        instance.hasChild = true
        
        instance.addEventListener('click', (e) ->
          # create a new window with one textfield with focus
          optionsWin = Ti.UI.createWindow({
            title: settings.title,
            backgroundColor: if Ti.Platform.osname is 'iphone' then 'stripped' else '#181818'
          })
          if settings.control is 'select'
            # add the list options
            value = Ti.App.Properties.getString(settings.name)
            data = []
            for option in settings.options
              row = Ti.UI.createTableViewRow({
                title: option.name,
                hasCheck: false
              })
              if option.name is value
                row.hasCheck = true
              data.push(row)
            optionsTableView = Ti.UI.createTableView({
              data: data,
              style: Titanium.UI.iPhone.TableViewStyle.GROUPED
            })
            optionsTableView.addEventListener('click', (f) ->
              if debug
                Ti.API.info(f)
              for row, i in optionsTableView.data[0].rows
                if i is f.index
                  optionsTableView.data[0].rows[i].hasCheck = true
                  Ti.App.Properties.setString(settings.name, optionsTableView.data[0].rows[i].title)
                  self.settingValueLabel.text = optionsTableView.data[0].rows[i].title
                else
                  optionsTableView.data[0].rows[i].hasCheck = false
            )
            optionsWin.add(optionsTableView)
          else
            # add the textfield option with keyboard focus
            textField = Ti.UI.createTextField({
              width: 300,
              height: 40,
              left: 10,
              top: 10,
              value: Ti.App.Properties.getString(settings.name),
              keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
              returnKeyType:Titanium.UI.RETURNKEY_DONE,
              borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
            })
            # Function saves property
            saveProperty = (f) ->
              if debug then Ti.API.info(settings.name + ' = ' + f)
              Ti.App.Properties.setString(settings.name, f)
              self.settingValueLabel.text = f
              optionsWin.close()
            textField.addEventListener('return', (f) ->
              saveProperty(@value)
            )
            optionsWin.add(textField)
            optionsWin.addEventListener('open', (f) ->
              textField.focus()
            )
            Ti.API.info('Ti.Platform.osname = ' + Ti.Platform.osname)
            if Ti.Platform.osname is 'android'
              optionsWin.addEventListener('android:back', (f) ->
                saveProperty(textField.value)
              )
          # this line doesn't make it very modular but I can't figure any other way to do this
          shl.ui.tabs.activeTab.open(optionsWin)
        )
      # creates an on/off switch
      when 'boolean'
        value = Ti.App.Properties.getBool(settings.name)
        settingSwitch = Ti.UI.createSwitch({
          value: if value? then value else false,
          right: 5
        })
        settingSwitch.addEventListener('change', (e) ->
          if debug then Ti.API.info(settings.name + ' = ' + e.value)
          Ti.App.Properties.setBool(settings.name, e.value)
        )
        instance.add(settingSwitch)
    
    return instance

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
    
    exportSection = Ti.UI.createTableViewSection({
      headerTitle: 'Export'
    })
    exportEmail = Ti.UI.createTableViewRow({
      title: 'Email a CSV'
    })
    exportEmail.addEventListener('click', (e) ->
      file = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, 'outreach.csv')
      prospects = shl.Prospect.find()
      Ti.API.info('prospects = ' + prospects.toJSON())
      csvString = ConvertToCSV(prospects.toJSON())
      Ti.API.info('csvString = ' + csvString)
      file.write(csvString)
      emailDialog = Ti.UI.createEmailDialog();
      emailDialog.addAttachment(file);
      emailDialog.open();
    )
    exportSection.add(exportEmail)
    
    data.push(exportSection)
    
    tableView = Ti.UI.createTableView({
      data: data,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    })
    settingsWin.add(tableView)
    
    return settingsWin
    
shl.settingsTab = new SettingsTab