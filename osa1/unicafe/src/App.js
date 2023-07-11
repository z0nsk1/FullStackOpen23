import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
    </button>
)

const Header = ({ props }) => (
  <h1>{props}</h1>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    console.log('Adding good feedback... value before', good)
    setGood(good + 1)
  }

  const handleNeutral = () => {
    console.log('Adding neutral feedback... value before', neutral)
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    console.log('Adding bad feedback... value before', bad)
    setBad(bad + 1)
  }

  return (
    <div>
      <Header props={'give feedback'}/>
      <Button handleClick={handleGood} text='good' />
      <Button handleClick={handleNeutral} text='neutral' />
      <Button handleClick={handleBad} text='bad' />
      <Header props={'statistics'}/>
      <div style={{lineHeight:'5px'}}>
        <p style={{color:'darkgreen'}}>good {good}</p>
        <p>neutral {neutral}</p>
        <p style={{color:'red'}}>bad {bad}</p>
      </div>
    </div>
  )
}

export default App