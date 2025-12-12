import { mockLists, mockUsers, mockNotifications } from './mockData.js';

// Simulace síťového zpoždění
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock localStorage pro simulaci persistence
const STORAGE_KEY = 'shopping_list_mock_data';

// Načtení dat z localStorage nebo použití default mock dat
function loadMockData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        lists: parsed.lists || mockLists,
        notifications: parsed.notifications || mockNotifications
      };
    }
  } catch (e) {
    console.warn('Error loading mock data from localStorage:', e);
  }
  
  return {
    lists: [... mockLists],
    notifications:  [...mockNotifications]
  };
}

// Uložení dat do localStorage
function saveMockData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Error saving mock data to localStorage:', e);
  }
}

// Globální mock store
let mockStore = loadMockData();

// Mock API implementace
export const mockApi = {
  
  // ========== LISTS API ==========
  
  async getLists() {
    await delay(300);
    console.log('📡 Mock API: getLists()');
    return {
      success: true,
      data: mockStore.lists
    };
  },

  async getList(listId) {
    await delay(200);
    console.log(`📡 Mock API: getList(${listId})`);
    
    const list = mockStore.lists.find(l => l.id === listId);
    if (!list) {
      return {
        success: false,
        error: 'Seznam nenalezen',
        status: 404
      };
    }
    
    return {
      success:  true,
      data: list
    };
  },

  async createList(name, owner) {
    await delay(400);
    console.log(`📡 Mock API: createList(${name}, ${owner})`);
    
    const newList = {
      id: `list-${Date.now()}`,
      name:  name. trim(),
      owner,
      members: [],
      items: [],
      accessRequests:  []
    };
    
    mockStore.lists.push(newList);
    saveMockData(mockStore);
    
    return {
      success: true,
      data: newList
    };
  },

  async updateList(listId, updates) {
    await delay(250);
    console.log(`📡 Mock API: updateList(${listId}, ${JSON.stringify(updates)})`);
    
    const listIndex = mockStore.lists.findIndex(l => l.id === listId);
    if (listIndex === -1) {
      return {
        success: false,
        error: 'Seznam nenalezen'
      };
    }
    
    mockStore.lists[listIndex] = { 
      ...mockStore.lists[listIndex], 
      ...updates 
    };
    saveMockData(mockStore);
    
    return {
      success: true,
      data: mockStore. lists[listIndex]
    };
  },

  async deleteList(listId) {
    await delay(300);
    console.log(`📡 Mock API: deleteList(${listId})`);
    
    const listIndex = mockStore.lists.findIndex(l => l.id === listId);
    if (listIndex === -1) {
      return {
        success: false,
        error: 'Seznam nenalezen'
      };
    }
    
    const deletedList = mockStore.lists.splice(listIndex, 1)[0];
    
    // Odstranit i související notifikace
    mockStore.notifications = mockStore.notifications.filter(n => n.listId !== listId);
    saveMockData(mockStore);
    
    return {
      success: true,
      data: deletedList
    };
  },

  // ========== ACCESS REQUESTS API ==========
  
  async requestAccess(listId, username, message) {
    await delay(350);
    console.log(`📡 Mock API: requestAccess(${listId}, ${username}, ${message})`);
    
    const list = mockStore.lists.find(l => l.id === listId);
    if (!list) {
      return {
        success:  false,
        error: 'Seznam nenalezen'
      };
    }

    const request = {
      id: `req-${Date.now()}`,
      username,
      message:  message.trim() || `${username} žádá o přístup k seznamu`,
      timestamp: Date.now()
    };

    list.accessRequests = list.accessRequests || [];
    
    // Kontrola duplicity
    const existingRequest = list.accessRequests.find(r => r.username === username);
    if (existingRequest) {
      return {
        success: false,
        error: 'Žádost už byla odeslána'
      };
    }
    
    list.accessRequests.push(request);

    // Přidat notifikaci pro vlastníka
    const notification = {
      id: `notif-${Date.now()}`,
      type: 'access_request',
      listId,
      listName: list.name,
      fromUser: username,
      message:  request.message,
      timestamp: Date.now(),
      read: false
    };

    mockStore.notifications.push(notification);
    saveMockData(mockStore);

    return {
      success: true,
      data: request
    };
  },

  async approveAccessRequest(listId, requestId) {
    await delay(300);
    console.log(`📡 Mock API: approveAccessRequest(${listId}, ${requestId})`);
    
    const list = mockStore.lists.find(l => l.id === listId);
    if (!list) {
      return {
        success:  false,
        error: 'Seznam nenalezen'
      };
    }

    const requestIndex = (list.accessRequests || []).findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      return {
        success: false,
        error: 'Žádost nenalezena'
      };
    }
    
    const request = list.accessRequests[requestIndex];
    
    // Přidat uživatele mezi členy
    list.members = list.members || [];
    if (!list.members.includes(request.username)) {
      list.members.push(request.username);
    }
    
    // Odstranit žádost
    list.accessRequests. splice(requestIndex, 1);
    
    // Označit notifikaci jako vyřešenou
    mockStore.notifications = mockStore.notifications.map(n => 
      n. type === 'access_request' && n.listId === listId && n.fromUser === request.username
        ?  { ...n, read: true }
        : n
    );
    
    saveMockData(mockStore);

    return {
      success: true,
      data: { 
        approvedUser: request.username,
        list: list
      }
    };
  },

  async rejectAccessRequest(listId, requestId) {
    await delay(250);
    console.log(`📡 Mock API: rejectAccessRequest(${listId}, ${requestId})`);
    
    const list = mockStore.lists. find(l => l.id === listId);
    if (!list) {
      return {
        success: false,
        error:  'Seznam nenalezen'
      };
    }

    const requestIndex = (list.accessRequests || []).findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      return {
        success: false,
        error: 'Žádost nenalezena'
      };
    }
    
    const request = list.accessRequests[requestIndex];
    list.accessRequests.splice(requestIndex, 1);
    
    // Označit notifikaci jako vyřešenou
    mockStore.notifications = mockStore.notifications. map(n => 
      n.type === 'access_request' && n.listId === listId && n.fromUser === request.username
        ? { ...n, read: true }
        :  n
    );
    
    saveMockData(mockStore);

    return {
      success:  true,
      data: { rejectedUser: request.username }
    };
  },

  // ========== NOTIFICATIONS API ==========
  
  async getNotifications(username) {
    await delay(200);
    console.log(`📡 Mock API: getNotifications(${username})`);
    
    // Najít seznamy, které vlastní daný uživatel
    const userLists = mockStore.lists.filter(l => l.owner === username);
    const userListIds = userLists. map(l => l.id);
    
    // Vrátit notifikace pouze pro seznamy tohoto uživatele
    const userNotifications = mockStore.notifications. filter(n => 
      userListIds.includes(n.listId)
    );
    
    return {
      success: true,
      data: userNotifications
    };
  },

  async markNotificationAsRead(notificationId) {
    await delay(150);
    console.log(`📡 Mock API: markNotificationAsRead(${notificationId})`);
    
    const notificationIndex = mockStore.notifications. findIndex(n => n.id === notificationId);
    if (notificationIndex === -1) {
      return {
        success: false,
        error: 'Notifikace nenalezena'
      };
    }
    
    mockStore.notifications[notificationIndex]. read = true;
    saveMockData(mockStore);
    
    return {
      success:  true,
      data: mockStore.notifications[notificationIndex]
    };
  },

  // ========== UTILITY METHODS ==========
  
  async getUsers() {
    await delay(100);
    console.log('📡 Mock API: getUsers()');
    return {
      success: true,
      data: mockUsers
    };
  },

  // Reset mock data to initial state
  resetMockData() {
    console.log('📡 Mock API: resetMockData()');
    mockStore = {
      lists: [... mockLists],
      notifications:  [...mockNotifications]
    };
    saveMockData(mockStore);
    return {
      success: true,
      message: 'Mock data byla resetována'
    };
  },

  // Get current mock store state (for debugging)
  getMockStore() {
    return { ... mockStore };
  }
};

// Export pro debugging
window.mockApi = mockApi;