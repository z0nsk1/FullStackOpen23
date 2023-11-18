import { useSelector, useDispatch } from "react-redux"
import { addVotes } from "../reducers/anecdoteReducer"
import { setNotification, rmNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    return state.filter !== null 
    ? state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase())) 
    : state.anecdotes
  })

  const vote = (id) => {
    console.log('vote', id)
    const votedAnecdote = anecdotes.find(a => a.id === id)
    dispatch(setNotification(`You voted for the anecdote "${votedAnecdote.content}"`))
    dispatch(addVotes(id))
    setTimeout(() => dispatch(rmNotification()), 5000)
  }

  return (
    <div>
      {[...anecdotes].sort((a, b) => parseInt(b.votes) - parseInt(a.votes)).map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div> 
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList