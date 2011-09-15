# Contains all the UI functions associated with the Stats Tab
class StatsTab
  constructor : () ->
    @win = @createStatsWindow()
    @tab = Ti.UI.createTab({
      title: 'Stats',
      window: @win,
      icon: 'images/16-line-chart.png'
    })
  
  createStatsWindow : () ->
    self = this
    statsWin = Ti.UI.createWindow({
     title : 'My Outreach Stats'
    })
    view = Ti.UI.createView()
    allTime = Ti.UI.createLabel ({
     text: 'TOTAL',
     top: 15,
     left: 30,
     height: 'auto',
     width: 200,
     font: {fontSize: 22, fontWeight: 'bold'},
     color: if shl.ui.isAndroid then '#eeeeee' else '#272b3e'
    })
    view.add(allTime)
    aVisits = shl.Contact.count({
     where: {
       type: 'Visit'
     }
    })
    aVisitTxt = Ti.UI.createLabel ({
     text: aVisits + ' visits',
     top: 40,
     left: 30,
     height: 'auto',
     width: 200,
     font: {fontSize: 18},
     color: '#8c8c8c'
    })
    view.add(aVisitTxt)
    aCalls = shl.Contact.count({
     where: {
       type: 'Phone Call'
     }
    })
    aCallsTxt = Ti.UI.createLabel ({
     text: aCalls + ' phone calls',
     top: 60,
     left: 30,
     height: 'auto',
     width: 200,
     font: {fontSize: 18},
     color: '#8c8c8c'
    })
    view.add(aCallsTxt)
    aSal = shl.Contact.count({
     where: {
       type: 'Saved'
     }
    })
    aSalTxt = Ti.UI.createLabel ({
     text: aSal + ' saved',
     top: 80,
     left: 30,
     height: 'auto',
     width: 200,
     font: {fontSize: 18},
     color: '#8c8c8c'
    })
    view.add(aSalTxt)
    aBap = shl.Contact.count({
      where: {
        type: 'Baptized'
      }
    })
    aBapTxt = Ti.UI.createLabel({
     text: aBap + ' baptized',
     top: 100,
     left: 30,
     height: 'auto',
     width: 200,
     font: {fontSize: 18},
     color: '#8c8c8c'
    })
    view.add(aBapTxt)
    thisMonth = Ti.UI.createLabel ({
      text: 'LAST 30 DAYS',
      top: 135,
      left: 30,
      height: 'auto',
      width: 200,
      font: {fontSize: 22, fontWeight: 'bold'},
      color: if shl.ui.isAndroid then '#eeeeee' else '#272b3e'
    })
    view.add(thisMonth)
    mVisits = shl.Contact.count({
      where : "type = 'Visit' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mVisitTxt = Ti.UI.createLabel ({
      text: mVisits + ' visits',
      top: 160,
      left: 30,
      height: 'auto',
      width: 200,
      font: {fontSize: 18},
      color: '#8c8c8c'
    })
    view.add(mVisitTxt)
    mCalls = shl.Contact.count({
      where : "type = 'Phone Call' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mCallsTxt = Ti.UI.createLabel ({
      text: mCalls + ' phone calls',
      top: 180,
      left: 30,
      height: 'auto',
      width: 200,
      font: {fontSize: 18},
      color: '#8c8c8c'
    })
    view.add(mCallsTxt)
    mSal = shl.Contact.count({
      where : "type = 'Saved' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mSalTxt = Ti.UI.createLabel ({
      text: mSal + ' saved',
      top: 200,
      left: 30,
      height: 'auto',
      width: 200,
      font: {fontSize: 18},
      color: '#8c8c8c'
    })
    view.add(mSalTxt)
    mBap = shl.Contact.count({
       where : "type = 'Baptized' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mBapTxt = Ti.UI.createLabel({
      text: mBap + ' baptized',
      top: 220,
      left: 30,
      height: 'auto',
      width: 200,
      font: {fontSize: 18},
      color: '#8c8c8c'
    })
    view.add(mBapTxt)
    statsWin.add(view)
    statsWin.addEventListener('open', (f) ->
      statsWin.addEventListener('focus', (g) ->
        aVisits = shl.Contact.count({
          where: {
            type: 'Visit'
          }
        })
        aVisitTxt.text = aVisits + ' visits'
        aCalls = shl.Contact.count({
          where: {
            type: 'Phone Call'
          }
        })
        aCallsTxt.text = aCalls + ' phone calls'
        aSal = shl.Contact.count({
          where: {
            type: 'Saved'
          }
        })
        aSalTxt.text = aSal + ' saved'
        aBap = shl.Contact.count({
          where: {
            type: 'Baptized'
          }
        })
        aBapTxt.text = aBap + ' baptized'
        mVisits = shl.Contact.count({
          where : "type = 'Visit' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mVisitTxt.text = mVisits + ' visits'
        mCalls = shl.Contact.count({
          where : "type = 'Phone Call' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mCallsTxt.text = mCalls + ' phone calls'
        mSal = shl.Contact.count({
          where : "type = 'Saved' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mSalTxt.text = mSal + ' saved'
        mBap = shl.Contact.count({
          where : "type = 'Baptized' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mBapTxt.text = mBap + ' baptized'
      )
    )
    return statsWin
  
shl.statsTab = new StatsTab