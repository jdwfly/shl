
/*
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
*/

(function() {

  exports.SettingRow = (function() {

    function SettingRow(args, settings) {
      var debug, instance, self, settingSwitch, settingTitleLabel, value;
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
      this.settingValueLabel = Ti.UI.createLabel({
        text: settings.value,
        right: Ti.Platform.osname === 'iphone' ? 5 : 30,
        width: 150,
        height: 'auto',
        textAlign: 'right'
      });
      if (settings.control !== 'boolean') instance.add(this.settingValueLabel);
      switch (settings.control) {
        case 'select':
        case 'text':
          instance.hasChild = true;
          instance.addEventListener('click', function(e) {
            var data, option, optionsTableView, optionsWin, row, saveProperty, textField, value, _i, _len, _ref;
            optionsWin = Ti.UI.createWindow({
              title: settings.title,
              backgroundColor: Ti.Platform.osname === 'iphone' ? 'stripped' : '#181818'
            });
            if (settings.control === 'select') {
              value = Ti.App.Properties.getString(settings.name);
              data = [];
              _ref = settings.options;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                row = Ti.UI.createTableViewRow({
                  title: option.name,
                  hasCheck: false
                });
                if (option.name === value) row.hasCheck = true;
                data.push(row);
              }
              optionsTableView = Ti.UI.createTableView({
                data: data,
                style: Titanium.UI.iPhone.TableViewStyle.GROUPED
              });
              optionsTableView.addEventListener('click', function(f) {
                var i, row, _len2, _ref2, _results;
                if (debug) Ti.API.info(f);
                _ref2 = optionsTableView.data[0].rows;
                _results = [];
                for (i = 0, _len2 = _ref2.length; i < _len2; i++) {
                  row = _ref2[i];
                  if (i === f.index) {
                    optionsTableView.data[0].rows[i].hasCheck = true;
                    Ti.App.Properties.setString(settings.name, optionsTableView.data[0].rows[i].title);
                    _results.push(self.settingValueLabel.text = optionsTableView.data[0].rows[i].title);
                  } else {
                    _results.push(optionsTableView.data[0].rows[i].hasCheck = false);
                  }
                }
                return _results;
              });
              optionsWin.add(optionsTableView);
            } else {
              textField = Ti.UI.createTextField({
                width: 300,
                height: 40,
                left: 10,
                top: 10,
                value: Ti.App.Properties.getString(settings.name),
                keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
                returnKeyType: Titanium.UI.RETURNKEY_DONE,
                borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
              });
              saveProperty = function(f) {
                if (debug) Ti.API.info(settings.name + ' = ' + f);
                Ti.App.Properties.setString(settings.name, f);
                self.settingValueLabel.text = f;
                return optionsWin.close();
              };
              textField.addEventListener('return', function(f) {
                return saveProperty(this.value);
              });
              optionsWin.add(textField);
              optionsWin.addEventListener('open', function(f) {
                return textField.focus();
              });
              Ti.API.info('Ti.Platform.osname = ' + Ti.Platform.osname);
              if (Ti.Platform.osname === 'android') {
                optionsWin.addEventListener('android:back', function(f) {
                  return saveProperty(textField.value);
                });
              }
            }
            return shl.ui.tabs.activeTab.open(optionsWin);
          });
          break;
        case 'boolean':
          value = Ti.App.Properties.getBool(settings.name);
          settingSwitch = Ti.UI.createSwitch({
            value: value != null ? value : false,
            right: 5
          });
          settingSwitch.addEventListener('change', function(e) {
            if (debug) Ti.API.info(settings.name + ' = ' + e.value);
            return Ti.App.Properties.setBool(settings.name, e.value);
          });
          instance.add(settingSwitch);
      }
      return instance;
    }

    return SettingRow;

  })();

}).call(this);
