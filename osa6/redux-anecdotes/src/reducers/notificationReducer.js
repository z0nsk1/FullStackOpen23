import { createSlice } from "@reduxjs/toolkit"

const initialState = 'do something...'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      const notification = action.payload
      return notification
    },
    rmNotification () {
      return initialState
    }
  }
})

export const { setNotification, rmNotification } = notificationSlice.actions
export default notificationSlice.reducer