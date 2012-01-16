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
      var win;
      win = shl.ui.createProspectFormWin();
      return win;
    };

    return AddTab;

  })();

  shl.addTab = new AddTab;

}).call(this);
