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
     text: 'Total',
     top: 10,
     left: 10,
     height: 'auto',
     width: 200
    })
    view.add(allTime)
    aVisits = shl.Contact.count({
     where: {
       type: 'Visit'
     }
    })
    aVisitTxt = Ti.UI.createLabel ({
     text: 'Visits: ' + aVisits,
     top: 30,
     left: 20,
     height: 'auto',
     width: 200
    })
    view.add(aVisitTxt)
    aCalls = shl.Contact.count({
     where: {
       type: 'Phone Call'
     }
    })
    aCallsTxt = Ti.UI.createLabel ({
     text: 'Phone Calls: ' + aCalls,
     top: 50,
     left: 20,
     height: 'auto',
     width: 200
    })
    view.add(aCallsTxt)
    aSal = shl.Contact.count({
     where: {
       type: 'Saved'
     }
    })
    aSalTxt = Ti.UI.createLabel ({
     text: 'Saved: ' + aSal,
     top: 70,
     left: 20,
     height: 'auto',
     width: 200
    })
    view.add(aSalTxt)
    aBap = shl.Contact.count({
      where: {
        type: 'Baptized'
      }
    })
    aBapTxt = Ti.UI.createLabel({
     text: 'Baptized: ' + aBap,
     top: 90,
     left: 20,
     height: 'auto',
     width: 200
    })
    view.add(aBapTxt)
    thisMonth = Ti.UI.createLabel ({
      text: 'Last 30 Days',
      top: 110,
      left: 10,
      height: 'auto',
      width: 200
    })
    view.add(thisMonth)
    mVisits = shl.Contact.count({
      where : "type = 'Visit' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mVisitTxt = Ti.UI.createLabel ({
      text: 'Visits: ' + mVisits,
      top: 130,
      left: 20,
      height: 'auto',
      width: 200
    })
    view.add(mVisitTxt)
    mCalls = shl.Contact.count({
      where : "type = 'Phone Call' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mCallsTxt = Ti.UI.createLabel ({
      text: 'Phone Calls: ' + mCalls,
      top: 150,
      left: 20,
      height: 'auto',
      width: 200
    })
    view.add(mCallsTxt)
    mSal = shl.Contact.count({
      where : "type = 'Saved' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mSalTxt = Ti.UI.createLabel ({
      text: 'Saved: ' + mSal,
      top: 170,
      left: 20,
      height: 'auto',
      width: 200
    })
    view.add(mSalTxt)
    mBap = shl.Contact.count({
       where : "type = 'Baptized' AND date > (strftime('%s', 'now') - 2592000)"
    })
    mBapTxt = Ti.UI.createLabel({
      text: 'Baptized: ' + mBap,
      top: 190,
      left: 20,
      height: 'auto',
      width: 200
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
        aVisitTxt.text = 'Visits: ' + aVisits
        aCalls = shl.Contact.count({
          where: {
            type: 'Phone Call'
          }
        })
        aCallsTxt.text = 'Phone Calls: ' + aCalls
        aSal = shl.Contact.count({
          where: {
            type: 'Saved'
          }
        })
        aSalTxt.text = 'Saved: ' + aSal
        aBap = shl.Contact.count({
          where: {
            type: 'Baptized'
          }
        })
        aBapTxt.text = 'Baptized: ' + aBap
        mVisits = shl.Contact.count({
          where : "type = 'Visit' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mVisitTxt.text = 'Visits: ' + mVisits
        mCalls = shl.Contact.count({
          where : "type = 'Phone Call' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mCallsTxt.text = 'Phone Calls: ' + mCalls
        mSal = shl.Contact.count({
          where : "type = 'Saved' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mSalTxt.text = 'Saved: ' + mSal
        mBap = shl.Contact.count({
          where : "type = 'Baptized' AND date > (strftime('%s', 'now') - 2592000)"
        })
        mBapTxt.text = 'Baptized: ' + mBap
      )
    )
    return statsWin
  
shl.statsTab = new StatsTab