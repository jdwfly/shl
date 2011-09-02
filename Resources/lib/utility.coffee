###
This class extends the TableViewRow to set an App wide property setting. Right
now there is just the standard On/Off switch, textfield, and select option list.
Examples of how to do so are below for posterity.

Example of an On/Off Switch
testRow = new SettingRow({},{
  name: 'testRow',
  control: 'boolean',
  value: Ti.App.Properties.getBool('testRow'),
  title: 'Test Row',
  debug: true
})
data.push(testRow)

Example of a Test Field
testRowText = new SettingRow({},{
  name: 'testRowText',
  control: 'text',
  value: Ti.App.Properties.getString('testRowText'),
  title: 'Test Row Text',
  debug: true
})

Example of a Select List
testRowList = new SettingRow({},{
  name: 'testRowList',
  control: 'select',
  value: Ti.App.Properties.getString('testRowList')
  title: 'Test Row List',
  options: [
    {name: 'Option 1'},
    {name: 'Option 2'},
    {name: 'Option 3'},
    {name: 'Option 4'}
    ]
  debug: true
})
###
class exports.SettingRow
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
            textField.addEventListener('return', (f) ->
              if debug then Ti.API.info(settings.name + ' = ' + @value)
              Ti.App.Properties.setString(settings.name, @value)
              self.settingValueLabel.text = @value
              optionsWin.close()
            )
            optionsWin.add(textField)
            optionsWin.addEventListener('open', (f) ->
              textField.focus()
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
