import axios from "axios"

const http = axios.create({
  baseURL: "http://localhost:5050",
})

http.interceptors.request.use( // Request Interceptor
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`  // Add jwt token to headers
      config.headers['Content-Type'] = 'application/json';  // Set content type
    }
    return config
  },
  (err) => Promise.reject(err)
)

export default http;