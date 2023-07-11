import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)



const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points , setPoints] = useState(new Uint8Array(8))
  const [biggest, setBiggest] = useState(0)
  console.log('Points-array', points, 'Index of the biggest number is', biggest)

  const handleAnecdote = () => {
    let rand = Math.floor(Math.random() * (anecdotes.length))
    setSelected(rand)
    console.log('Choosing a random number to pick anecdote. The random number is ', rand)
  }

  const handleVote = () => {
    console.log('Voting... votes total before', points[selected])
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
    setBiggest(points.indexOf(Math.max(...points)))
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p style={{height:'2em'}}>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button handleClick={handleVote} text='vote'/>
      <Button handleClick={handleAnecdote} text='next anecdote'/>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[biggest]}</p>
      <p>has {points[biggest]} votes</p>
    </div>
  )
}

export default App