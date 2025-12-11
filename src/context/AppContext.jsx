import React, { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'shopping_list_vite_v2'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

const makeList = ({ name = 'Nový seznam', owner = null, members = [], items = [] } = {}) => ({
  id: uid(),
  name,
  owner,
  members,
  items,
  accessRequests: [] // Nové pole pro žádosti o přístup
})

const defaultModel = {
  lists: [],
  currentUser: null,
  notifications: [] // Notifikace pro uživatele
}

function loadModel() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultModel }
    return { ...defaultModel, ...JSON. parse(raw) }
  } catch (e) {
    console.warn('Chyba při načítání localStorage', e)
    return { ...defaultModel }
  }
}

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [model, setModel] = useState(() => loadModel())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(model))
    } catch (e) {
      console.warn('Chyba při ukládání', e)
    }
  }, [model])

  const createList = (name) => {
    if (! model.currentUser) {
      alert('Přihlas se, abys mohl vytvořit seznam.')
      return
    }
    const newList = makeList({ name, owner: model.currentUser })
    setModel(prev => ({
      ...prev,
      lists: [...prev.lists, newList]
    }))
    return newList. id
  }

  const deleteList = (listId) => {
    const list = model.lists. find(l => l.id === listId)
    if (!list || list.owner !== model. currentUser) {
      alert('Nemáš oprávnění smazat tento seznam.')
      return
    }
    
    setModel(prev => ({
      ...prev,
      lists: prev.lists.filter(l => l.id !== listId)
    }))
  }

  const updateList = (listId, updates) => {
    setModel(prev => ({
      ...prev,
      lists: prev.lists.map(list => 
        list.id === listId ? { ...list, ...updates } :  list
      )
    }))
  }

  // Nová funkce:  Žádost o přístup
  const requestAccess = (listId, message = '') => {
    if (!model.currentUser) {
      alert('Musíš být přihlášen')
      return
    }

    const list = model.lists. find(l => l.id === listId)
    if (!list) return

    const existingRequest = (list.accessRequests || []).find(r => r.username === model.currentUser)
    if (existingRequest) {
      alert('Žádost už byla odeslána')
      return
    }

    const newRequest = {
      id: uid(),
      username: model.currentUser,
      message: message.trim() || `${model.currentUser} žádá o přístup k seznamu`,
      timestamp: Date.now()
    }

    // Přidání žádosti k seznamu
    updateList(listId, {
      accessRequests: [...(list.accessRequests || []), newRequest]
    })

    // Přidání notifikace vlastníkovi
    const notification = {
      id: uid(),
      type: 'access_request',
      listId,
      listName: list.name,
      fromUser: model.currentUser,
      message: newRequest.message,
      timestamp: Date. now(),
      read: false
    }

    setModel(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification]
    }))

    alert('Žádost byla odeslána vlastníkovi seznamu')
  }

  // Schválení žádosti
  const approveAccessRequest = (listId, requestId) => {
    const list = model.lists.find(l => l.id === listId)
    if (!list || list.owner !== model.currentUser) return

    const request = (list.accessRequests || []).find(r => r.id === requestId)
    if (!request) return

    // Přidat uživatele mezi členy
    const newMembers = [... (list.members || []), request.username]
    
    // Odstranit žádost
    const newRequests = (list.accessRequests || []).filter(r => r.id !== requestId)

    updateList(listId, {
      members: newMembers,
      accessRequests: newRequests
    })

    // Označit notifikaci jako vyřešenou
    setModel(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.type === 'access_request' && n.listId === listId && n.fromUser === request.username
          ?  { ...n, read: true }
          : n
      )
    }))

    alert(`Uživatel ${request. username} byl přidán do seznamu`)
  }

  // Zamítnutí žádosti
  const rejectAccessRequest = (listId, requestId) => {
    const list = model. lists.find(l => l.id === listId)
    if (!list || list.owner !== model.currentUser) return

    const newRequests = (list.accessRequests || []).filter(r => r.id !== requestId)
    updateList(listId, { accessRequests: newRequests })

    // Označit notifikaci jako vyřešenou
    setModel(prev => ({
      ... prev,
      notifications: prev.notifications.map(n => 
        n.type === 'access_request' && n.listId === listId
          ? { ...n, read: true }
          : n
      )
    }))
  }

  const login = (username) => {
    setModel(prev => ({ ...prev, currentUser: username }))
  }

  const logout = () => {
    setModel(prev => ({ ...prev, currentUser: null }))
  }

  const canDeleteList = (list) => {
    return list && model.currentUser && list.owner === model.currentUser
  }

  // Počet nepřečtených notifikací pro aktuálního uživatele
  const getUnreadNotifications = () => {
    return model.notifications.filter(n => 
      ! n.read && 
      model.lists.some(list => list.id === n.listId && list.owner === model.currentUser)
    )
  }

  const markNotificationAsRead = (notificationId) => {
    setModel(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n. id === notificationId ? { ...n, read: true } : n
      )
    }))
  }

  const value = {
    ... model,
    createList,
    deleteList,
    updateList,
    requestAccess,
    approveAccessRequest,
    rejectAccessRequest,
    login,
    logout,
    canDeleteList,
    getUnreadNotifications,
    markNotificationAsRead
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}