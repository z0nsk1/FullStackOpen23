import { useSelector, useDispatch } from "react-redux"
import { addVotes } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    return state.filter !== null 
    ? state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase())) 
    : state.anecdotes
  })

  const vote = (id) => {
    console.log('vote', id)
    dispatch(addVotes(id))
  }

  return (
    <div>
      {anecdotes.sort((a, b) => parseInt(b.votes) - parseInt(a.votes)).map(anecdote =>
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