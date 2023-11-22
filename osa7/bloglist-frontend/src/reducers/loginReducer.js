import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import { setNotification } from './notificationReducer'
import blogService from '../services/blogs'

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    loginUser(state, action) {
      return action.payload
    }
  }
})

export const login = (loginInfo) => {
  return async dispatch => {
    try {
      const user = await loginService.login(loginInfo)
      console.log(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogsappUser', JSON.stringify(user))
      dispatch(loginUser(user))
    } catch (error) {
      dispatch(setNotification(error.response.data.error))
    }
  }
}

export const logout = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBlogsappUser')
    dispatch(loginUser(null))
  }
}

export const { loginUser } = loginSlice.actions
export default loginSlice.reducer