# Set variables
finishedLoading = Ti.App.getBool('finishedLoading')

# Call first to start debug process
shl.appStartup = () ->
  if not finishedLoading
    shl.magicFix()
  Ti.App.Properties.setBool('finishedLoading', false)
  shl.debug('App is starting up')

# call when app is ready to use
shl.appLoaded = () ->
  Ti.App.Properties.setBool('finishedLoading', true)
  shl.debug('App has loaded and is ready to use')

# send debug information
#shl.sendDebugInfo = () ->
  #
# debug wrapper
shl.debug = (msg) ->
  if shl.debugMode
    Ti.API.info('debug: ' + msg)

# Include wrapper
shl.include = (file) ->
  shl.debug('Preparing to include ' + file)
  Ti.include(file)

# magic function, here be dragons
shl.magicFix = () ->
  shl.debug('Magic fix initiated')
