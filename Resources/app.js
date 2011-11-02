var shl = {};
shl.debugMode = true;
Ti.include('lib/debug.js');
shl.appStartup();

Ti.UI.setBackgroundColor('#ffffff');

shl.include('active_record.js');
shl.include('helpers.js');
shl.include('db.js');
shl.include('ui.js');
shl.include('ui.liststab.js');
shl.include('ui.starredtab.js');
shl.include('ui.addtab.js');
shl.include('ui.searchtab.js');
shl.include('ui.statstab.js');
shl.include('ui.settingstab.js');

shl.ui.createApplicationTabGroup();

Ti.API.info('Welcome to Outreach for '+Ti.Platform.osname);
shl.appLoaded();
