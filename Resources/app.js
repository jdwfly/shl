Ti.UI.setBackgroundColor('#ffffff');

var shl = {};
shl.debugMode = false;
Ti.include('active_record.js');
Ti.include('helpers.js');
Ti.include('db.js');
Ti.include('ui.js');
Ti.include('ui.liststab.js');
Ti.include('ui.starredtab.js');
Ti.include('ui.addtab.js');
Ti.include('ui.searchtab.js');

shl.ui.createApplicationTabGroup();

Ti.API.info('Welcome to Outreach for '+Ti.Platform.osname);