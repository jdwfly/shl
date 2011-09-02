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
      var data, self, settingsWin, tableView;
      self = this;
      settingsWin = Ti.UI.createWindow({
        title: 'Settings'
      });
      data = [];
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
