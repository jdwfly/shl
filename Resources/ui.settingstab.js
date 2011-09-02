(function() {
  var SettingRow, SettingsTab;
  SettingRow = require('lib/utility').SettingRow;
  SettingsTab = (function() {
    function SettingsTab() {
      this.win = this.createSettingsWindow();
      this.tab = Ti.UI.createTab({
        title: 'Settings',
        window: this.win,
        icon: 'images/20-gear2.png'
      });
    }
    SettingsTab.prototype.createSettingsWindow = function() {
      var data, self, settingsWin, tableView, testRow, testRowText;
      self = this;
      settingsWin = Ti.UI.createWindow({
        title: 'Settings'
      });
      data = [];
      testRow = SettingRow({}, {
        name: 'testRow',
        control: 'boolean',
        value: Ti.App.Properties.getBool('testRow'),
        title: 'Test Row',
        debug: true
      });
      data.push(testRow);
      testRowText = SettingRow({}, {
        name: 'testRowText',
        control: 'text',
        value: Ti.App.Properties.getString('testRowText'),
        title: 'Test Row Text',
        debug: true
      });
      data.push(testRowText);
      tableView = Ti.UI.createTableView({
        data: data
      });
      settingsWin.add(tableView);
      return settingsWin;
    };
    return SettingsTab;
  })();
  shl.settingsTab = new SettingsTab;
}).call(this);
