(function() {
  exports.SettingRow = (function() {
    function SettingRow(args, settings) {
      var debug, instance, self, settingSwitch, settingTitleLabel, settingValueLabel;
      self = this;
      instance = Ti.UI.createTableViewRow(args);
      instance.settingName = settings.name;
      debug = settings.debug != null ? settings.debug : false;
      settingTitleLabel = Ti.UI.createLabel({
        text: settings.title,
        left: 5,
        width: 'auto',
        height: 'auto'
      });
      instance.add(settingTitleLabel);
      settingValueLabel = Ti.UI.createLabel({
        text: settings.value,
        right: 5,
        width: 'auto',
        height: 'auto'
      });
      if (settings.control !== 'boolean') {
        instance.add(settingValueLabel);
      }
      switch (settings.control) {
        case 'select':
        case 'text':
          instance.hasChild = true;
          instance.addEventListener('click', function(e) {
            var textField, textFieldWin;
            textFieldWin = Ti.UI.createWindow({
              title: settings.title,
              backgroundColor: 'stripped'
            });
            if (settings.control === 'select') {} else {
              textField = Ti.UI.createTextField({
                width: 300,
                height: 40,
                left: 10,
                top: 10,
                value: this.value,
                keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
                returnKeyType: Titanium.UI.RETURNKEY_DONE,
                borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
              });
              textField.addEventListener('return', function(f) {
                if (debug) {
                  Ti.API.info(settings.name + ' = ' + this.value);
                }
                Ti.App.Properties.setString(settings.name, this.value);
                settingValueLabel.text = this.value;
                return textFieldWin.close();
              });
              textFieldWin.add(textField);
              textFieldWin.addEventListener('focus', function(f) {
                return textField.focus();
              });
            }
            return textFieldWin.open();
          });
          break;
        case 'boolean':
          settingSwitch = Ti.UI.createSwitch({
            value: settings.value,
            right: 5
          });
          settingSwitch.addEventListener('change', function(e) {
            if (debug) {
              Ti.API.info(settings.name + ' = ' + e.value);
            }
            return Ti.App.Properties.setBool(settings.name, e.value);
          });
          instance.add(settingSwitch);
      }
      return instance;
    }
    return SettingRow;
  })();
}).call(this);
