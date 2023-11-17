import { useSelector, useDispatch } from "react-redux"
import { addVotes } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

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