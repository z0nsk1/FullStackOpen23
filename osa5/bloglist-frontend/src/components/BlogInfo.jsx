
const blogInfo = ({blog}) => {

  return (
    <div>
       <p>{blog.url}</p>
       <p>likes {blog.likes} <button>like</button></p>
       <p>{blog.author}</p>
    </div>
  )
}

export default blogInfo