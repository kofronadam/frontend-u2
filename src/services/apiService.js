import { mockApi } from './mockApi.js';

// Konfigurace API
const API_CONFIG = {
  useMockApi: import.meta.env. DEV || import.meta.env. VITE_USE_MOCK === 'true',
  baseUrl: import.meta. env. VITE_API_URL || 'https://api.shopping-lists.com',
  timeout: 5000
};

// Real API implementace (pro produkci)
const realApi = {
  async getLists() {
    const response = await fetch(`${API_CONFIG. baseUrl}/lists`, {
      method:  'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (! response.ok) {
      throw new Error(`HTTP ${response.status}:  ${response.statusText}`);
    }
    
    return response.json();
  },

  async getList(listId) {
    const response = await fetch(`${API_CONFIG.baseUrl}/lists/${listId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async createList(name, owner) {
    const response = await fetch(`${API_CONFIG. baseUrl}/lists`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, owner })
    });
    return response.json();
  },

  async updateList(listId, updates) {
    const response = await fetch(`${API_CONFIG. baseUrl}/lists/${listId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:  JSON.stringify(updates)
    });
    return response.json();
  },

  async deleteList(listId) {
    const response = await fetch(`${API_CONFIG.baseUrl}/lists/${listId}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  async requestAccess(listId, username, message) {
    const response = await fetch(`${API_CONFIG. baseUrl}/lists/${listId}/access-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message })
    });
    return response.json();
  },

  async approveAccessRequest(listId, requestId) {
    const response = await fetch(`${API_CONFIG.baseUrl}/lists/${listId}/access-requests/${requestId}/approve`, {
      method:  'POST'
    });
    return response.json();
  },

  async rejectAccessRequest(listId, requestId) {
    const response = await fetch(`${API_CONFIG. baseUrl}/lists/${listId}/access-requests/${requestId}/reject`, {
      method: 'POST'
    });
    return response.json();
  },

  async getNotifications(username) {
    const response = await fetch(`${API_CONFIG. baseUrl}/notifications/${username}`);
    return response.json();
  },

  async markNotificationAsRead(notificationId) {
    const response = await fetch(`${API_CONFIG.baseUrl}/notifications/${notificationId}/read`, {
      method:  'PUT'
    });
    return response.json();
  }
};

// Hlavní API service
export const apiService = API_CONFIG.useMockApi ? mockApi : realApi;

// Export konfigurace
export { API_CONFIG };

// Pro debugging
if (API_CONFIG.useMockApi) {
  console.log('🔧 Development mode: Using Mock API');
  window.apiService = apiService;
} else {
  console. log('🚀 Production mode:  Using Real API');
}