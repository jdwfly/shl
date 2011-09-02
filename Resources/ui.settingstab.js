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
      var data, self, settingsWin, tableView, testRow, testRowList, testRowText;
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
      testRowList = SettingRow({}, {
        name: 'testRowList',
        control: 'select',
        value: Ti.App.Properties.getString('testRowList'),
        title: 'Test Row List',
        options: [
          {
            name: 'Option 1'
          }, {
            name: 'Option 2'
          }, {
            name: 'Option 3'
          }, {
            name: 'Option 4'
          }
        ],
        debug: true
      });
      data.push(testRowList);
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
