var shl = {};
shl.debugMode = false;
Ti.include('lib/debug.js');
shl.appStartup();

Ti.UI.setBackgroundColor('#ffffff');

Ti.include('active_record.js');
Ti.include('helpers.js');
Ti.include('db.js');
Ti.include('ui.js');
Ti.include('ui.liststab.js');
Ti.include('ui.starredtab.js');
Ti.include('ui.addtab.js');
Ti.include('ui.searchtab.js');
// Goodbye stats tab you give us trouble :P
//Ti.include('ui.statstab.js');
Ti.include('ui.settingstab.js');

shl.ui.createApplicationTabGroup();

Ti.API.info('Welcome to Outreach for '+Ti.Platform.osname);
shl.appLoaded();
