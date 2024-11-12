import { configureStore } from '@reduxjs/toolkit'
import menuReducer from '@/lib/features/menu'
import tenantReducer from '@/lib/features/tenantSlice'
import apiReducer from '@/lib/features/apiKeySlice'

export const store = configureStore({
  reducer: {
    menuState: menuReducer,
    tenantState: tenantReducer,
    apiState: apiReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type ReduxStore = {
  getState: () => RootState
  dispatch: AppDispatch
}
