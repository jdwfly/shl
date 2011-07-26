# Contains all functions associated with the Lists Window Tab
class ListsTab
  constructor: () ->
    @win = @createListsWindow()
    @tab = Ti.UI.createTab({
      title: 'Lists',
      window: @win
      icon: 'images/179-notepad.png'
    })
  
  createListsWindow : () ->
    self = this
    win = Ti.UI.createWindow({
      title: 'Lists'
      activity: {
        onCreateOptionsMenu : (e) ->
          menu = e.menu
          m1 = menu.add({title: 'Add Prospect'})
          m2 = menu.add({title: 'Add List'})
          m1.addEventListener('click', (e) ->
            # TODO: call add prospect window
            alert('clicked')
          )
          m2.addEventListener('click', (e) ->
            # TODO: call add list window
            alert('clicked')
          )
      }
    })
    # TODO: call the function to get all Lists
    lists = shl.List.find({
      where: {active: 1},
      order: 'weight ASC'
    })
    Ti.API.info('lists = ' + lists.toJSON())
    tableView = @createListTableView(lists)
    win.add(tableView)
    
    win.addEventListener('open', (e) ->
      win.addEventListener('focus', (e) ->
        lists = shl.List.find({
          where: {active: 1},
          order: 'weight ASC'
        })
        tableView.updateLists(lists)
      )
    )
    
    return win
    
  createListTableView : (lists) ->
    self = this
    data = shl.ui.processListData(lists)
    tableView = Ti.UI.createTableView({
      data:data,
      moveable: true
    })
    tableView.addEventListener('click', (e) ->
      Ti.API.info(JSON.stringify(e.row))
      if e.row.listID == 'custom'
        addW = Ti.UI.createWindow({
          title:'New Custom List',
          backgroundColor: '#BBBBBB'
        })
        lname = Ti.UI.createTextField({
          height:40,
          width: 300,
          top: 10,
          backgroundColor: '#ffffff'
          keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
          returnKeyType:Titanium.UI.RETURNKEY_DONE,
          borderStyle:Titanium.UI.INPUT_BORDERSTYLE_BEZEL,
          hintText:L('List Name')
        })
        addW.add(lname)
        b = Ti.UI.createButton({
          width: 300,
          height: 57,
          top: 60,
          title: 'Save',
          color: '#fff',
          backgroundImage: '/images/button_blue.png'
        })
        b.addEventListener('click', () ->
          if lname.value isnt ''
            # Create an object to save to the database
            createdList = shl.List.create({
              name: lname.value,
              weight: 0,
              active: 1
            })
            # TODO : show a list of prospects to add to the list
            addW.close()
          else
            alert('You must specify a name for the list.')
        )
        addW.add(b)
        c = Ti.UI.createButton({
          width: 300,
          height: 57,
          top: 125,
          title: 'Cancel',
          color: '#fff',
          backgroundImage: '/images/button_blue.png'
        })
        c.addEventListener('click', () ->
          addW.close()
        )
        addW.add(c)
        addW.open({
          modal:true,
          modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
          modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        })
        return true
      if e.row.listID == 'more'
        allLists = shl.List.find({
          where: "name <> 'Starred'",
          order: 'weight ASC'
        })
        tableView.updateLists(allLists)
        index = tableView.getIndexByName('more');
        tableView.deleteRow(index)
        newRow = Ti.UI.createTableViewRow({
          height: 'auto',
          title: 'Hide Extra Lists',
          listID: 'less',
          editable: false,
          moveable: false,
          name: 'less'
        })
        tableView.appendRow(newRow)
        return true
      if e.row.listID == 'less'
        allLists = shl.List.find({
          where: {active: 1},
          order: 'weight ASC'
        })
        tableView.updateLists(allLists)
        return true
      # Determine if the list is an auto list
      listWin = Ti.UI.createWindow()
      listWin.addEventListener('open', (f) ->
        listWin.addEventListener('focus', (g) ->
          if query?
            prospects = shl.Prospect.find(query)
          else
            currentList = shl.List.find(e.row.listID)
            prospects = currentList.getProspectList()
            listWin.setRightNavButton(listedit)
            listview.editing = false
          data = shl.ui.processProspectData(prospects)
          listview.setData(data)
        )
      )
      if shl.aLists[e.row.title]?
        listWin.title = e.row.title
        query = shl.aLists[e.row.title].query
        prospects = shl.Prospect.find(shl.aLists[e.row.title].query)
        Ti.API.info('prospects = ' + prospects.toJSON())
        listview = shl.ui.createProspectTableView(prospects)
        listWin.add(listview)
        shl.ui.tabs.activeTab.open(listWin)
      else
        listWin.title = e.row.title
        currentList = shl.List.find(e.row.listID)
        
        Ti.API.info('currentList = ' + currentList.toJSON())
        Ti.API.info('currentList = ' + JSON.stringify(ActiveRecord))
        prospects = currentList.getProspectList()
        Ti.API.info('prospects = ' + JSON.stringify(prospects))
        listview = shl.ui.createProspectTableView(prospects)
        listview.deleteButtonTitle = 'Remove'
        listview.editable = true
        listview.allowsSelectionDuringEditing = true
        listview.addEventListener('delete',(e) ->
          currentListing = shl.Listing.find({
            first : true,
            where: {
              list_id : currentList.id,
              prospect_id : e.row.prospect.id
            }
          })
          currentListing.destroy()
        )
        
        listWin.add(listview)
        listedit = Titanium.UI.createButton({
          title:'Edit'
        })
        listedit.addEventListener('click', () ->
          listWin.setRightNavButton(listcancel)
          listview.editing = true
          brow = Ti.UI.createTableViewRow({
            backgroundColor : '#999',
            height : 50,
            editable : false,
            name : 'options'
          })
          editBtns = Ti.UI.createView({
            height : 50,
            width : 300,
            layout : 'horizontal'
          })
          addBtn = Ti.UI.createButton({
            title : 'Add',
            width : 88,
            height : 38,
            left : 9,
            top : 6
          })
          addBtn.addEventListener('click', () ->
            addProspectsWin = @createAddProspectsWindow(e.row.listID)
            addProspectsWin.open({
              modal:true,
              modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
              modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
            })
          )
          clearBtn = Ti.UI.createButton({
            title : 'Clear',
            width : 88,
            height : 38,
            left : 9,
            top : 6
          })
          clearBtn.addEventListener('click', () ->
            a = Titanium.UI.createAlertDialog({
              title:'Clear list?',
              buttonNames : ['OK','Cancel'],
              cancel : 1
            })
            a.addEventListener('click', (g) ->
              Ti.API.info(e.index)
              if g.index == 0
                listings = currentList.getListingList()
                for listing in listings
                  listing.destroy()
                currentList = shl.List.find(e.row.listID)
                prospects = currentList.getProspectList()
                listWin.setRightNavButton(listedit)
                listview.editing = false
                data = shl.ui.processProspectData(prospects)
                listview.setData(data)
            )
            a.show()
          )
          deleteBtn = Ti.UI.createButton({
            title : 'Delete',
            width : 88,
            height : 38,
            left : 9,
            top : 6
          })
          deleteBtn.addEventListener('click', (g)->
            a = Titanium.UI.createAlertDialog({
              title:'Delete list?',
              buttonNames : ['OK','Cancel'],
              cancel : 1
            })
            a.addEventListener('click', (g) ->
              Ti.API.info(e.index)
              if g.index == 0
                listings = currentList.getListingList()
                for listing in listings
                  listing.destroy()
                currentList.destroy()
                listWin.close()
            )
            a.show()
          )
          editBtns.add(addBtn)
          editBtns.add(clearBtn)
          editBtns.add(deleteBtn)
          brow.add(editBtns)
          if listview.data[0] and listview.data[0].rows.length >= 1
            listview.insertRowBefore(0,brow)
          else
            listview.appendRow(brow)
        )
        
        listcancel = Titanium.UI.createButton({
          title:'Done',
          style:Titanium.UI.iPhone.SystemButtonStyle.DONE
        })
        listcancel.addEventListener('click', () ->
          listWin.setRightNavButton(listedit)
          listview.editing = false
          index = listview.getIndexByName('options');
          listview.deleteRow(index,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.UP})
        )
        listWin.setRightNavButton(listedit)
        
        shl.ui.tabs.activeTab.open(listWin)
    )
    tableView.updateLists = (lists) ->
      data = shl.ui.processListData(lists)
      @setData(data)
    
    return tableView
  
  createAddProspectsWindow : (listId) ->
    self = this
    win = Ti.UI.createWindow({
      title : 'Add Prospects'
    })
    doneBtn = Ti.UI.createButton({
      title:'Done',
      width:100,
      height:30
    })
    doneBtn.addEventListener('click', () ->
      win.close()
    )
    win.setRightNavButton(doneBtn)
    prospects = shl.Prospect.find()
    if prospects.length < 1
      return win
    createRow = (prospect)->
      row = Ti.UI.createTableViewRow({
        height: 70
      })
      contentTitle = Ti.UI.createLabel({
        text: prospect.formatName(),
        font: {fontWeight: 'bold', fontSize:18},
        height: 30,
        top : 5,
        width: 'auto',
        left: 5
      })
      addressLabel = Ti.UI.createLabel({
        text: prospect.formatAddress(),
        font: {fontWeight: 'normal', fontSize: 12},
        height: 35,
        width: 'auto',
        height: 'auto',
        top: 33,
        left: 5,
        bottom: 5
      })
      row.add(contentTitle)
      row.add(addressLabel)
      row.prospect = prospect
      addBtn = Ti.UI.createButton({
        backgroundImage:'/images/addDefault.png',
        height:27,
        width:27,
        right:10,
        top: 20
      })
      addBtn.addEventListener('click', () ->
        Ti.API.info(prospect)
        shl.Listing.create {
          list_id : listId,
          prospect_id : prospect.id
        }
        row.backgroundColor = '#AAAAAA'
        setTimeout( () ->
          deleteBtn.show()
        ,100)
        addBtn.hide()
        contentTitle.animate({left:50, duration:100})
        addressLabel.animate({left:50, duration:100})
      )
      row.add(addBtn)
      deleteBtn = Ti.UI.createButton({
        backgroundImage:'/images/minusDefault.png',
        height:27,
        width:27,
        left:10,
        top: 20,
        visible:false
      })
      deleteBtn.addEventListener('click', () ->
        todelete = shl.Listing.find({
          where : {
            prospect_id : prospect.id,
            list_id : listId
          }
        })
        for listing in todelete
          listing.destroy()
        row.backgroundColor = '#ffffff'
        deleteBtn.hide()
        addBtn.show()
        contentTitle.animate({left:10, duration:100})
        addressLabel.animate({left:10, duration:100})
      )
      row.add(deleteBtn)
      currentList = shl.List.find(listId)
      prospectsList = currentList.getProspectList()
      listMembers = for prosp in prospectsList
        prosp.id
      if prospect.id in listMembers
        deleteBtn.visible = true
        addBtn.visible = false
        contentTitle.left = 55
        addressLabel.left = 55
      row
    
    data = for prospect in prospects
      createRow(prospect)
    
    tableView = Ti.UI.createTableView({data:data})
    win.add(tableView)
    #TODO set this diferently for Android
    return win
    
shl.listsTab = new ListsTab