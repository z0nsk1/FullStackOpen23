import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      return state.concat(action.payload)
    }
  }
})

export const initializeBlogs = () => {
  return async dispatch => {
    try {
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs))
    } catch (error) {
      dispatch(setNotification(error.response.data.error))
    }
  }
}

export const createBlog = (newBlog) => {
  return async dispatch => {
    try {
      const blog = await blogService.create(newBlog)
      //dispatch(addBlog(blog))
      dispatch(initializeBlogs()) // väliaikainen ratkaisu, kunnes saadaan kirjautunut käyttäjä globaaliin tilaan. Huono, koska tekee get-metodin jokaisella kerralla (ei tosin merkitystä tämän kokoisessa sovelluksessa)
    } catch (error) {
      dispatch(setNotification(error.response.data.error))
    }
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    console.log(blog)
    try {
      await blogService.put(blog)
      dispatch(initializeBlogs())
    } catch (error) {
      dispatch(setNotification(error.response.data.error))
    }
  }
}

export const removeBlog = (blog) => {
  return async dispatch => {
    console.log(blog)
    try {
      await blogService.remove(blog)
      dispatch(initializeBlogs())
    } catch (error) {
      dispatch(setNotification(error.response.data.error))
    }
  }
}

export const { setBlogs, addBlog, updateBlog } = blogSlice.actions
export default blogSlice.reducer