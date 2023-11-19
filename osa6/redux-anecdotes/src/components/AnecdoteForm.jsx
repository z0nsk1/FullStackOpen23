import { useDispatch } from 'react-redux'
import { asObject, createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, rmNotification } from '../reducers/notificationReducer'
import anecodoteService from '../services/anecdote'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = event.target.anecdote.value
    console.log(anecdote)
    event.target.anecdote.value = ''
    dispatch(setNotification('A new anecdote created')) // Statusviesti storeen reducerin kautta
    dispatch(createAnecdote(anecdote)) // Laitetaan uusi anekdootti reducerille, joka hoitaa storeen tallentamisen
    await anecodoteService.createNew(asObject(anecdote)) // Talletetaan uusi anekdootti tietokantaan, käytetään olion muodostuksessa anecdoteReducerissa olevaa metodia asObject (jotta olio saadaan talletettua oikeassa formaatissa)
    setTimeout(() => dispatch(rmNotification()), 5000) // Timeout statusilmoitukselle
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