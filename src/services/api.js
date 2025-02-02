import { API_CONFIG } from '../config';

class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API Error');
    }
    return data;
  }

  async login(credentials) {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return this.handleResponse(response);
  }

  async register(userData) {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async createParcel(parcelData) {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.PARCELS}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(parcelData)
    });
    return this.handleResponse(response);
  }

  async getParcels() {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.PARCELS}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getParcel(id) {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.PARCELS}/${id}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Driver endpoints
  async getDriverAssignments() {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.DRIVER.ASSIGNMENTS}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateDriverLocation(location) {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.DRIVER.LOCATION}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(location)
    });
    return this.handleResponse(response);
  }

  async updateParcelStatus(parcelId, statusData) {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.DRIVER.PARCEL}/${parcelId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(statusData)
    });
    return this.handleResponse(response);
  }

  // Admin endpoints
  async getAdminStats() {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ADMIN.STATS}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getDrivers() {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ADMIN.DRIVERS}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async assignDriver(assignmentData) {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ADMIN.ASSIGN_DRIVER}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(assignmentData)
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
