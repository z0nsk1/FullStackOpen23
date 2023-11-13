import { useState } from 'react'
import PropTypes, { object } from 'prop-types'

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  const [showInfo, setShowInfo] = useState(false)
  const [showRemove, setShowRemove] = useState(false)

  const hideWhenVisible = { display: showInfo ? 'none' : '' }
  const showWhenVisible = { display: showInfo ? '' : 'none' }
  const showIfOwner = { display: showRemove ? '' : 'none' }

  const toggleInfo = () => {
    if (blog.user.id === user.id) {
      setShowRemove(true)
    }
    setShowInfo(!showInfo)
  }

  const like = async () => {
    likeBlog(blog)
  }

  const remove = async () => {
    if (window.confirm(`Do you really want to remove blog "${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleInfo}>view</button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.title} {blog.author} <button onClick={toggleInfo}>hide</button></p>
        <p>{blog.url}</p>
        <p>likes: {blog.likes} <button onClick={like}>like</button></p>
        <p>{blog.user.name}</p>
        <button style={showIfOwner} onClick={remove}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog