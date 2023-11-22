import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const NewBlogForm = () => {
  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    const title = event.target.Title.value // talletaan inputtien data nimen perusteella muuttujiin
    const author = event.target.Author.value
    const url = event.target.Url.value
    console.log(title)

    dispatch(createBlog({ title: title, author: author, url: url })) // dispatchataan muuttujat oliona blogreducerille
    dispatch(setNotification('a new blog added', 'status'))
  }


  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            type="text"
            name="Title"
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            name="Author"
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            name="Url"
          />
        </div>
        <button id="create" type="submit">create</button>
      </form>
    </div>
  )
}

export default NewBlogForm