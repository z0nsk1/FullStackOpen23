import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, rmNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = event.target.anecdote.value
    console.log(anecdote)
    event.target.anecdote.value = ''
    dispatch(setNotification('A new anecdote created', 5)) // Statusviesti storeen reducerin kautta
    dispatch(createAnecdote(anecdote)) // Laitetaan uusi anekdootti reducerille, joka hoitaa storeen tallentamisen
    setTimeout(() => dispatch(rmNotification()), 5000)
  }
  
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdote'/></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm