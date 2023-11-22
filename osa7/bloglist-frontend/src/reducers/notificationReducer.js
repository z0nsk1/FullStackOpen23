import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null, // alkutila
  reducers: {
    setMsg(state, action) {
      const message = action.payload
      return message
    },
    rmMsg(state, action) {
      return null
    }
  }
})

export const setNotification = (message, type) => {
  return async dispatch => {
    dispatch(setMsg([message, type])) // Kutsutaan setMsg reduceria, joka palauttaa viestin.
    setTimeout(() => {
      dispatch(rmMsg()) // 4s kuluttua asetetaan viesti nulliksi.
    }, 4000)
  }
}

export const { setMsg, rmMsg } = notificationSlice.actions
export default notificationSlice.reducer