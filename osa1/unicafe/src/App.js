import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
    </button>
)

const Header = ({ props }) => (
  <h1>{props}</h1>
)

const Statistics = ({text, value}) => {
  if (text === "positive") {
    return (
      <p>{text} {value} %</p>
    )
  }
  return (
    <p>{text} {value}</p>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const handleGood = () => {
    console.log('Adding good feedback... value before', good)
    setGood(good + 1)
    setAll(all + 1)
  }

  const handleNeutral = () => {
    console.log('Adding neutral feedback... value before', neutral)
    setNeutral(neutral + 1)
    setAll(all + 1)
  }

  const handleBad = () => {
    console.log('Adding bad feedback... value before', bad)
    setBad(bad + 1)
    setAll(all + 1)
  }

  if (all === 0) {
    return (
      <div>
        <Header props={'give feedback'}/>
        <Button handleClick={handleGood} text='good' />
        <Button handleClick={handleNeutral} text='neutral' />
        <Button handleClick={handleBad} text='bad' />
        <Header props={'statistics'}/>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <Header props={'give feedback'}/>
      <Button handleClick={handleGood} text='good' />
      <Button handleClick={handleNeutral} text='neutral' />
      <Button handleClick={handleBad} text='bad' />
      <Header props={'statistics'}/>
      <div style={{lineHeight:'5px'}}>
        <Statistics text={'good'} value={good}/>
        <Statistics text={'neutral'} value={neutral}/>
        <Statistics text={'bad'} value={bad}/>
        <Statistics text={'all'} value={all}/>
        <Statistics text={'average'} value={(good - bad) / all}/>
        <Statistics text={'positive'} value={(good / all) * 100}/>
      </div>
    </div>
  )
}

export default App