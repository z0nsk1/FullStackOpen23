import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdote'

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
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    saveVotes(state, action) {
      // Palautetaan state mapattuna. Mapataan kaikki paitsi anekdootti, jolla on sama id, kuin actionin mukana tulleella anekdootilla,
      // ja sen kohdalla mapataankin mukaan actionin mukana tullut päivitetty anekdootti
      return state.map(a => a.id !== action.payload.id ? a : action.payload)
    }
  }
})

export const { setAnecdotes, appendAnecdote, saveVotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = anecdote => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(asObject(anecdote))
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVotes = votedAnecdote => {
  return async dispatch => {
    const votesSetAnecdote = {
    ...votedAnecdote, votes: votedAnecdote.votes + 1
    }
    const votesToDb = await anecdoteService.updateAnecdote(votesSetAnecdote)
    dispatch(saveVotes(votesToDb))
  }
}

export default anecdoteSlice.reducer