import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type TenantState = {
  id: string | null
  name: string | null
  createdAt: string | null
}

// Initial state for tenants
const initialState: TenantState = {
  id: null,
  name: null,
  createdAt: null,
}

const getTenantFromLocalStorage = (): TenantState => {
  const tenant = localStorage.getItem('tenant')
  return tenant ? JSON.parse(tenant) : initialState
}

const tenantSlice = createSlice({
  name: 'tenant',
  initialState: getTenantFromLocalStorage,
  reducers: {
    // Set tenant information (e.g., after registration)
    setTenant: (
      state,
      action: PayloadAction<{ id: string; name: string }> // createdAt: string
    ) => {
      state.id = action.payload.id
      state.name = action.payload.name
      //state.createdAt = action.payload.createdAt
      localStorage.setItem('tenant', JSON.stringify(state))
    },

    // Clear tenant data (e.g., on logout or tenant deletion)
    clearTenant: (state) => {
      //   state.id = null
      //   state.name = null
      //   state.createdAt = null

      localStorage.setItem('tenant', JSON.stringify(initialState))
      return initialState
    },
  },
})

export const { setTenant, clearTenant } = tenantSlice.actions

export default tenantSlice.reducer
