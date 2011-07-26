(function() {
  var AddTab;
  AddTab = (function() {
    function AddTab() {
      this.win = this.createAddWindow();
      this.tab = Ti.UI.createTab({
        title: 'Add',
        window: this.win,
        icon: 'images/13-plus.png'
      });
    }
    AddTab.prototype.createAddWindow = function() {
      var webView, win;
      if (this.isAndroid) {
        win = Ti.UI.createWindow({
          title: 'Add Prospect'
        });
        webView = Ti.UI.createWebView({
          url: 'addProspect.html'
        });
        Ti.App.addEventListener('webToTi', function(e) {
          return Ti.API.info('webToTi Sent: ' + JSON.stringify(e));
        });
        win.add(webView);
        return win;
      }
      win = shl.ui.createProspectFormWin();
      return win;
    };
    return AddTab;
  })();
  shl.addTab = new AddTab;
}).call(this);
