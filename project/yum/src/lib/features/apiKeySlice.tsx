import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ApiKeyState = {
  apiKey: string | null
  //   isLoading: boolean
  //   error: string | null
}

const initialApiKeyState: ApiKeyState = {
  apiKey: null,
}

const getApiKeyFromLocalStorage = (): ApiKeyState => {
  const apiKey = localStorage.getItem('tenant')
  return apiKey ? JSON.parse(apiKey) : initialApiKeyState
}

const apiKeySlice = createSlice({
  name: 'apiKey',
  initialState: getApiKeyFromLocalStorage,
  reducers: {
    setApiKey(state, action: PayloadAction<string>) {
      state.apiKey = action.payload
      localStorage.setItem('tenant', JSON.stringify(state))
    },

    clearApiKey(state) {
      // state.apiKey = null
      localStorage.setItem('tenant', JSON.stringify(initialApiKeyState))
      return initialApiKeyState
    },
  },
})

export const { setApiKey, clearApiKey } = apiKeySlice.actions
export default apiKeySlice.reducer
