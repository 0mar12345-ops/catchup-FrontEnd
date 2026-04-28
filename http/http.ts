import axios from 'axios'

const rawBaseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'
const sanitizedBaseURL = rawBaseURL.replace(/\/$/, '')

export const BASE_URL = `${sanitizedBaseURL}/api`

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor to handle OAuth errors globally
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if this is an OAuth authentication error
    if (
      error.response?.status === 401 &&
      error.response?.data?.error === 'oauth_invalid'
    ) {
      // Store the error information for the OAuth status provider to pick up
      if (typeof window !== 'undefined') {
        // Trigger a redirect to the accounts page
        window.location.href = '/accounts?oauth_expired=true'
      }
    }
    return Promise.reject(error)
  }
)

export default http
