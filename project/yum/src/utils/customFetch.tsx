import axios from 'axios'
const customFetch = axios.create({
  baseURL: 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com',
  headers: {
    'Content-Type': 'application/json', //required
    Accept: 'application/json',
  },
})
import { store } from '@/lib/store'
// Adding interceptors to include headers in each request
customFetch.interceptors.request.use(
  (config) => {
    // Fetch the API key and tenant name from the Redux store

    const subdomain = '9oxx' //|| window.location.hostname.split('.')[0] //C:\Windows\System32\drivers\etc\hosts // local dev env.

    const apiKey = store.getState().apiState.apiKey || 'yum-7BTxHCyHhzI'
    const tenant = store.getState().tenantState.name || subdomain

    // Include headers if values exist
    if (apiKey) {
      config.headers['Authorization'] = `Bearer ${apiKey}`
    }
    if (tenant) {
      config.headers['X-Tenant-Name'] = tenant
    }
    config.headers['Content-Type'] = 'application/json'

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

customFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error with request:', error.config)
    console.error('Error details:', error)
    return Promise.reject(error)
  }
)

//customFetch.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default customFetch
//  'Content-Type': 'multipart/form-data',
