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
    settingValueLabel = Ti.UI.createLabel({
      text: settings.value,
      right: 5,
      width: 'auto',
      height: 'auto'
    })
    if settings.control isnt 'boolean'
      instance.add(settingValueLabel)
    # Add the type of control
    switch settings.control
      when 'select', 'text'
        instance.hasChild = true
        
        instance.addEventListener('click', (e) ->
          # create a new window with one textfield with focus
          textFieldWin = Ti.UI.createWindow({
            title: settings.title,
            backgroundColor: 'stripped'
          })
          if settings.control is 'select'
            # add the list options
          else
            # add the textfield option with keyboard focus
            textField = Ti.UI.createTextField({
              width: 300,
              height: 40,
              left: 10,
              top: 10,
              value: @value,
              keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
              returnKeyType:Titanium.UI.RETURNKEY_DONE,
              borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
            })
            textField.addEventListener('return', (f) ->
              if debug then Ti.API.info(settings.name + ' = ' + @value)
              Ti.App.Properties.setString(settings.name, @value)
              settingValueLabel.text = @value
              textFieldWin.close()
            )
            textFieldWin.add(textField)
            textFieldWin.addEventListener('focus', (f) ->
              textField.focus()
            )
            
          textFieldWin.open()
        )
      # creates an on/off switch
      when 'boolean'
        settingSwitch = Ti.UI.createSwitch({
          value: settings.value,
          right: 5
        })
        settingSwitch.addEventListener('change', (e) ->
          if debug then Ti.API.info(settings.name + ' = ' + e.value)
          Ti.App.Properties.setBool(settings.name, e.value)
        )
        instance.add(settingSwitch)
    
    return instance
