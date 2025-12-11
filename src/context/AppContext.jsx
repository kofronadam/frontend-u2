import React, { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'shopping_list_vite_v2'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

const makeList = ({ name = 'Nový seznam', owner = null, members = [], items = [] } = {}) => ({
  id: uid(),
  name,
  owner,
  members,
  items
})

const defaultModel = {
  lists: [],
  currentUser: null
}

function loadModel() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultModel }
    return { ...defaultModel, ... JSON.parse(raw) }
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
    if (!model.currentUser) {
      alert('Přihlas se, abys mohl vytvořit seznam.')
      return
    }
    const newList = makeList({ name, owner: model.currentUser })
    setModel(prev => ({
      ...prev,
      lists: [... prev.lists, newList]
    }))
    return newList. id
  }

  const deleteList = (listId) => {
    const list = model.lists. find(l => l.id === listId)
    if (!list) return
    
    // Kontrola oprávnění - pouze vlastník může mazat
    if (list. owner !== model.currentUser) {
      alert('Nemáš oprávnění smazat tento seznam.')
      return
    }
    
    setModel(prev => ({
      ... prev,
      lists: prev.lists. filter(l => l.id !== listId)
    }))
  }

  const updateList = (listId, updates) => {
    setModel(prev => ({
      ...prev,
      lists: prev.lists.map(list => 
        list.id === listId ? { ...list, ...updates } : list
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

  const value = {
    ... model,
    createList,
    deleteList,
    updateList,
    login,
    logout,
    canDeleteList
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}