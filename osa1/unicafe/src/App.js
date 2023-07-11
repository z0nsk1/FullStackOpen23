import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
    </button>
)

const Header = ({ props }) => (
  <h1>{props}</h1>
)

const Statistics = ({ good, neutral, bad, all }) => {
  return (
    <table>
      <StatisticLine text={'good'} value={good}/>
      <StatisticLine text={'neutral'} value={neutral}/>
      <StatisticLine text={'bad'} value={bad}/>
      <StatisticLine text={'all'} value={all}/>
      <StatisticLine text={'average'} value={(good - bad) / all}/>
      <StatisticLine text={'positive'} value={(good / all) * 100}/>
    </table>
  )
}

const StatisticLine = ({ text, value }) => {
  // Prosenttimerkki paikalle, ei kovin järkevä toteutus
  if (text === 'positive') {
    return (
      <tbody>
      <tr>
        <td>{text}</td>
        <td>{value} %</td>
      </tr>
    </tbody>
    )
  }
  return (
    <tbody>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </tbody>
  )
}

const App = () => {
  // napeille omat tilat
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  // Palautteiden käsittelijät
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

  // jos palautteita ei ole, tulostetaan "no feedback given"
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
  // muussa tapauksessa tulostetaan palautteet
  return (
    <div>
      <Header props={'give feedback'}/>
      <Button handleClick={handleGood} text='good' />
      <Button handleClick={handleNeutral} text='neutral' />
      <Button handleClick={handleBad} text='bad' />
      <Header props={'statistics'}/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all}/>
    </div>
  )
}

export default App