(function() {
  var finishedLoading;
  finishedLoading = Ti.App.getBool('finishedLoading');
  shl.appStartup = function() {
    if (!finishedLoading) {
      shl.magicFix();
    }
    Ti.App.Properties.setBool('finishedLoading', false);
    return shl.debug('App is starting up');
  };
  shl.appLoaded = function() {
    Ti.App.Properties.setBool('finishedLoading', true);
    return shl.debug('App has loaded and is ready to use');
  };
  shl.debug = function(msg) {
    if (shl.debugMode) {
      return Ti.API.info('debug: ' + msg);
    }
  };
  shl.include = function(file) {
    shl.debug('Preparing to include ' + file);
    return Ti.include(file);
  };
  shl.magicFix = function() {
    return shl.debug('Magic fix initiated');
  };
}).call(this);
