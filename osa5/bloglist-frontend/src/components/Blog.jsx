import Togglable from "./Togglable"
import BlogInfo from "./BlogInfo"
import { useState } from "react"

const Blog = ({ blog }) => {
  const [showInfo, setShowInfo] = useState(false)

  const hideWhenVisible = { display: showInfo ? 'none' : '' }
  const showWhenVisible = { display: showInfo ? '' : 'none' }

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }
  return (
    <div>
      <div style={hideWhenVisible}>
      {blog.title} <button onClick={toggleInfo}>view</button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.title} <button onClick={toggleInfo}>hide</button></p>
        <p>{blog.url}</p>
        <p>likes: {blog.likes} <button>like</button></p>
        <p>{blog.author}</p>
      </div>
    </div>
  )
}

export default Blog