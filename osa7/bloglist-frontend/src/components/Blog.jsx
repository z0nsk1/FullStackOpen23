import { useState } from 'react'
import PropTypes from 'prop-types'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const Blog = ({ blog, user }) => {
  const [showInfo, setShowInfo] = useState(false)
  const [showRemove, setShowRemove] = useState(false)

  const dispatch = useDispatch()

  const hideWhenVisible = { display: showInfo ? 'none' : '' }
  const showWhenVisible = { display: showInfo ? '' : 'none' }
  const showIfOwner = { display: showRemove ? '' : 'none' }

  const toggleInfo = () => {
    if (blog.user.id === user.id) {
      setShowRemove(true)
    }
    setShowInfo(!showInfo)
  }

  const like = () => {
    dispatch(likeBlog(blog))
    dispatch(setNotification(`You liked liked the blog ${blog.title}`, 'status'))
  }

  const remove = async () => {
    if (window.confirm(`Do you really want to remove blog "${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog))
      dispatch(setNotification(`Blog "${blog.title}" was deleted successfully`, 'status'))
    }
  }

  return (
    <div>
      <div style={hideWhenVisible} className='blogTitle'>
        {blog.title} {blog.author} <button id='view' onClick={toggleInfo}>view</button>
      </div>
      <div style={showWhenVisible} className='blogInfo'>
        <p>{blog.title} {blog.author} <button onClick={toggleInfo}>hide</button></p>
        <p>{blog.url}</p>
        <p>likes: {blog.likes} <button id='like' onClick={like}>like</button></p>
        <p>{blog.user.name}</p>
        <button id='remove' style={showIfOwner} onClick={remove}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog