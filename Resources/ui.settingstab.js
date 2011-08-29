(function() {
  var SettingsTab;
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
      var self, settingsWin;
      self = this;
      settingsWin = Ti.UI.createWindow({
        title: 'Settings'
      });
      return settingsWin;
    };
    return SettingsTab;
  })();
  shl.settingsTab = new SettingsTab;
}).call(this);
