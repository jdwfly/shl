Ti.UI.setBackgroundColor('#ffffff');

var shl = {};
Ti.include('ui.js', 'db.js');

var tabs = shl.ui.createApplicationTabGroup();
tabs.open();

Ti.API.info('Welcome to Outreach for '+Ti.Platform.osname);
