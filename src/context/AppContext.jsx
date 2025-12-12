import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiService } from '../services/apiService.js'

// Vytvoření kontextu
const AppContext = createContext()

// Hook pro použití kontextu
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

// AppProvider komponenta
export const AppProvider = ({ children }) => {
  // Globální stav aplikace
  const [state, setState] = useState({
    lists:  [],
    currentUser: null,
    notifications: [],
    loading: false,
    error:  null
  })

  // ========== HELPER FUNCTIONS ==========
  
  const setLoading = (loading) => {
    setState(prev => ({ ...prev, loading }))
  }

  const setError = (error) => {
    setState(prev => ({ ... prev, error }))
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  // ========== INITIALIZATION ==========
  
  // Načtení uživatele z localStorage při startu
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setState(prev => ({ ...prev, currentUser: savedUser }))
    }
  }, [])

  // Načtení seznamů při změně uživatele
  useEffect(() => {
    if (state.currentUser) {
      loadLists()
      loadNotifications()
    }
  }, [state.currentUser])

  // ========== API CALLS ==========
  
  const loadLists = async () => {
    setLoading(true)
    clearError()
    
    try {
      console.log('🔄 Loading lists...')
      const response = await apiService.getLists()
      
      if (response. success) {
        setState(prev => ({ 
          ...prev, 
          lists:  response.data,
          loading: false 
        }))
        console.log('✅ Lists loaded:', response.data. length)
      } else {
        throw new Error(response. error || 'Chyba při načítání seznamů')
      }
    } catch (err) {
      console.error('❌ Error loading lists:', err)
      setError(err. message)
      setLoading(false)
    }
  }

  const loadNotifications = async () => {
    if (!state.currentUser) return
    
    try {
      const response = await apiService.getNotifications(state.currentUser)
      
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          notifications: response.data 
        }))
        console.log('🔔 Notifications loaded:', response.data.length)
      }
    } catch (err) {
      console.error('❌ Error loading notifications:', err)
      // Není kritická chyba, takže nestavíme error state
    }
  }

  // ========== USER MANAGEMENT ==========
  
  const login = (username) => {
    const trimmedUsername = username. trim()
    if (!trimmedUsername) {
      setError('Uživatelské jméno nemůže být prázdné')
      return
    }

    console.log('👤 Logging in user:', trimmedUsername)
    localStorage.setItem('currentUser', trimmedUsername)
    setState(prev => ({ 
      ...prev, 
      currentUser: trimmedUsername,
      error: null 
    }))
  }

  const logout = () => {
    console.log('👋 Logging out user')
    localStorage.removeItem('currentUser')
    setState(prev => ({
      ...prev,
      currentUser:  null,
      lists: [],
      notifications: [],
      error: null
    }))
  }

  // ========== LIST MANAGEMENT ==========
  
  const createList = async (name) => {
    if (!state.currentUser) {
      setError('Musíte být přihlášeni pro vytvoření seznamu')
      return null
    }

    if (!name?. trim()) {
      setError('Název seznamu nemůže být prázdný')
      return null
    }

    setLoading(true)
    clearError()
    
    try {
      console.log('📝 Creating list:', name)
      const response = await apiService. createList(name. trim(), state.currentUser)
      
      if (response. success) {
        setState(prev => ({ 
          ...prev, 
          lists: [...prev.lists, response.data],
          loading: false 
        }))
        console.log('✅ List created:', response.data.id)
        return response.data. id
      } else {
        throw new Error(response.error || 'Chyba při vytváření seznamu')
      }
    } catch (err) {
      console.error('❌ Error creating list:', err)
      setError(err. message)
      setLoading(false)
      return null
    }
  }

  const updateList = async (listId, updates) => {
    if (!listId || !updates) return

    // Optimistic update - aktualizace UI před API voláním
    setState(prev => ({
      ...prev,
      lists: prev.lists.map(list => 
        list. id === listId ?  { ...list, ... updates } : list
      )
    }))

    try {
      console. log('📝 Updating list:', listId, updates)
      const response = await apiService.updateList(listId, updates)
      
      if (response. success) {
        // Aktualizace s daty ze serveru (případné rozdíly)
        setState(prev => ({
          ...prev,
          lists: prev.lists.map(list => 
            list.id === listId ? response.data : list
          )
        }))
        console.log('✅ List updated:', listId)
      } else {
        // Rollback při chybě
        loadLists()
        throw new Error(response. error || 'Chyba při aktualizaci seznamu')
      }
    } catch (err) {
      console.error('❌ Error updating list:', err)
      // Rollback - znovu načtení dat
      loadLists()
      setError(err.message)
    }
  }

  const deleteList = async (listId) => {
    const list = state.lists. find(l => l.id === listId)
    if (!list) {
      setError('Seznam nenalezen')
      return
    }

    if (list.owner !== state. currentUser) {
      setError('Nemáte oprávnění smazat tento seznam')
      return
    }

    setLoading(true)
    clearError()
    
    try {
      console. log('🗑️ Deleting list:', listId)
      const response = await apiService.deleteList(listId)
      
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          lists: prev.lists.filter(l => l.id !== listId),
          loading: false 
        }))
        console.log('✅ List deleted:', listId)
      } else {
        throw new Error(response.error || 'Chyba při mazání seznamu')
      }
    } catch (err) {
      console.error('❌ Error deleting list:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  // ========== ACCESS REQUEST MANAGEMENT ==========
  
  const requestAccess = async (listId, message = '') => {
    if (!state.currentUser) {
      setError('Musíte být přihlášeni')
      return
    }

    try {
      console. log('🔑 Requesting access to list:', listId)
      const response = await apiService.requestAccess(listId, state.currentUser, message)
      
      if (response.success) {
        // Aktualizace seznamu s novou žádostí
        setState(prev => ({
          ...prev,
          lists: prev.lists.map(list => 
            list.id === listId 
              ? { 
                  ...list, 
                  accessRequests: [...(list.accessRequests || []), response.data]
                }
              : list
          )
        }))
        console.log('✅ Access requested:', response.data.id)
      } else {
        throw new Error(response.error || 'Chyba při žádosti o přístup')
      }
    } catch (err) {
      console.error('❌ Error requesting access:', err)
      setError(err. message)
    }
  }

  const approveAccessRequest = async (listId, requestId) => {
    try {
      console. log('✅ Approving access request:', requestId)
      const response = await apiService.approveAccessRequest(listId, requestId)
      
      if (response.success) {
        // Aktualizace seznamu - přidání člena, odstranění žádosti
        setState(prev => ({
          ... prev,
          lists: prev.lists. map(list => 
            list.id === listId 
              ? {
                  ...list,
                  members: [...(list. members || []), response.data. approvedUser],
                  accessRequests: (list.accessRequests || []).filter(r => r.id !== requestId)
                }
              :  list
          )
        }))
        
        // Znovu načíst notifikace
        loadNotifications()
        console.log('✅ Access approved for:', response.data.approvedUser)
      } else {
        throw new Error(response.error || 'Chyba při schvalování žádosti')
      }
    } catch (err) {
      console.error('❌ Error approving access:', err)
      setError(err.message)
    }
  }

  const rejectAccessRequest = async (listId, requestId) => {
    try {
      console.log('❌ Rejecting access request:', requestId)
      const response = await apiService. rejectAccessRequest(listId, requestId)
      
      if (response.success) {
        // Aktualizace seznamu - odstranění žádosti
        setState(prev => ({
          ...prev,
          lists: prev. lists.map(list => 
            list.id === listId 
              ? {
                  ...list,
                  accessRequests: (list.accessRequests || []).filter(r => r.id !== requestId)
                }
              : list
          )
        }))
        
        // Znovu načíst notifikace
        loadNotifications()
        console.log('✅ Access rejected for:', response.data.rejectedUser)
      } else {
        throw new Error(response.error || 'Chyba při zamítání žádosti')
      }
    } catch (err) {
      console.error('❌ Error rejecting access:', err)
      setError(err.message)
    }
  }

  // ========== NOTIFICATION MANAGEMENT ==========
  
  const getUnreadNotifications = () => {
    return state.notifications.filter(n => 
      ! n.read && 
      state.lists.some(list => list.id === n.listId && list.owner === state. currentUser)
    )
  }

  const markNotificationAsRead = async (notificationId) => {
    try {
      // Optimistic update
      setState(prev => ({
        ...prev,
        notifications:  prev.notifications.map(n => 
          n.id === notificationId ?  { ...n, read: true } : n
        )
      }))

      const response = await apiService.markNotificationAsRead(notificationId)
      
      if (! response.success) {
        // Rollback při chybě
        loadNotifications()
        throw new Error(response.error || 'Chyba při označování notifikace')
      }
      
      console.log('✅ Notification marked as read:', notificationId)
    } catch (err) {
      console.error('❌ Error marking notification as read:', err)
      loadNotifications() // Rollback
    }
  }

  // ========== UTILITY FUNCTIONS ==========
  
  const canDeleteList = (list) => {
    return list && state.currentUser && list.owner === state.currentUser
  }

  const isListMember = (list) => {
    if (!list || !state.currentUser) return false
    return list.owner === state.currentUser || (list.members || []).includes(state.currentUser)
  }

  const getListsByFilter = (filterType = 'all') => {
    if (! state.currentUser) return state.lists

    switch (filterType) {
      case 'mine':
        return state.lists.filter(list => list.owner === state.currentUser)
      case 'shared':
        return state.lists.filter(list => 
          list.owner !== state.currentUser && 
          (list.members || []).includes(state.currentUser)
        )
      default:
        return state.lists. filter(list => isListMember(list))
    }
  }

  const refreshData = async () => {
    if (state.currentUser) {
      await Promise.all([
        loadLists(),
        loadNotifications()
      ])
    }
  }

  // ========== CONTEXT VALUE ==========
  
  const contextValue = {
    // State
    lists: state.lists,
    currentUser: state.currentUser,
    notifications: state.notifications,
    loading: state.loading,
    error: state.error,

    // User management
    login,
    logout,

    // List management
    createList,
    updateList,
    deleteList,
    canDeleteList,
    isListMember,
    getListsByFilter,

    // Access request management
    requestAccess,
    approveAccessRequest,
    rejectAccessRequest,

    // Notification management
    getUnreadNotifications,
    markNotificationAsRead,

    // Utility
    clearError,
    refreshData,
    loadLists
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

// Export pro debugging
if (process.env.NODE_ENV === 'development') {
  window.AppContext = AppContext
}