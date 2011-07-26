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
    data = @processListData(lists)
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
          data = self.processProspectData(prospects)
          listview.setData(data)
        )
      )
      if shl.aLists[e.row.title]?
        listWin.title = e.row.title
        query = shl.aLists[e.row.title].query
        prospects = shl.Prospect.find(shl.aLists[e.row.title].query)
        Ti.API.info('prospects = ' + prospects.toJSON())
        listview = self.createProspectTableView(prospects)
        listWin.add(listview)
        self.tabs.activeTab.open(listWin)
      else
        listWin.title = e.row.title
        currentList = shl.List.find(e.row.listID)
        
        Ti.API.info('currentList = ' + currentList.toJSON())
        Ti.API.info('currentList = ' + JSON.stringify(ActiveRecord))
        prospects = currentList.getProspectList()
        Ti.API.info('prospects = ' + JSON.stringify(prospects))
        listview = self.createProspectTableView(prospects)
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
            addProspectsWin = self.createAddProspectsWindow(e.row.listID)
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
                data = self.processProspectData(prospects)
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
        
        self.tabs.activeTab.open(listWin)
    )
    tableView.updateLists = (lists) ->
      data = self.processListData(lists)
      @setData(data)
    
    return tableView
    
  processListData : (lists) ->
    data = for i in lists
      row = Ti.UI.createTableViewRow({
        height: 45,
        hasChild: true,
        title: i.name,
        listID: i.id,
        editable: false,
        moveable: true
      })
      if shl.aLists[i.name]?
        listcount = shl.Prospect.count(shl.aLists[i.name].query)
      else
        currentList = shl.List.find(i.id)
        listcount = currentList.getProspectCount()
      countView = Ti.UI.createLabel({
        text: listcount,
        #backgroundImage:'/images/count-bg.png',
        fontSize: 12,
        height: 21,
        width: 36,
        #top: 5,
        textAlign: 'center',
        right: 5,
        color: '#616161'
      })
      row.add(countView)
      row
    addCustom = Ti.UI.createTableViewRow({
      height: 45,
      title: 'Create Custom List...',
      listID: 'custom',
      editable: false,
      moveable: false
    })
    data.push(addCustom)
    viewMore = Ti.UI.createTableViewRow({
      height: 45,
      title: 'View All Lists',
      listID: 'more',
      editable: false,
      moveable: false,
      name: 'more'
    })
    data.push(viewMore)
    return data
    
shl.listsTab = new ListsTab