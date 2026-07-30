/**
 * api.js — Frontend API Service
 * Handles HTTP network communication between the React frontend and the Express backend server.
 */

const API_BASE_URL = 'http://localhost:5000/api/bookings';

export async function registerDemoBooking(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Registration failed.');
      error.status = response.status;
      error.field = data.field || null;
      error.errors = data.errors || null;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.message = error.message || 'Unable to connect to backend server. Please make sure backend is running.';
    }
    throw error;
  }
}

export async function verifyBookingSession(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.success ? data.booking : null;
  } catch (error) {
    return null;
  }
}
