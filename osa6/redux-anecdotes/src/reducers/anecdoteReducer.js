import { createSlice } from "@reduxjs/toolkit"

const getId = () => (100000 * Math.random()).toFixed(0)

export const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    addVotes(state, action) {
      const votedAnecdote = state.find(a => a.id === action.payload)
      const votesSetAnecdote = {
      ...votedAnecdote, votes: votedAnecdote.votes + 1
      }
      console.log(JSON.parse(JSON.stringify(votesSetAnecdote)))
      return state.map(anecdote => anecdote.id !== action.payload ? anecdote : votesSetAnecdote)
    },
    createAnecdote(state, action) {
      console.log(action.payload)
      const newAnecdote = asObject(action.payload)
      state.push(newAnecdote)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { addVotes, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer