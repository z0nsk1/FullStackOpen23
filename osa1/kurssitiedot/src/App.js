const Header = (props) => {
  console.log(props)
  return (
    <>
      <h1>{props.header}</h1>
    </>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <p>{props.desc} {props.count}</p>
  )

}

const Content = (props) => {
  console.log(props)
  return (
    <>
      <Part desc={props.part1} count={props.exercises1}/>
      <Part desc={props.part2} count={props.exercises2}/>
      <Part desc={props.part3} count={props.exercises3}/>
    </>
    
  )
}

const Total = (props) => {
  console.log(props)
  return (
    <>
      <p>Number of exercices {props.sum}</p>
    </>
  )
}

const App = () => {
  const header = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header header={header}/>
      <Content part1={part1} exercises1={exercises1} part2={part2} exercises2={exercises2} part3={part3} exercises3={exercises3}/>
      <Total sum={exercises1 + exercises2 + exercises3}/>
    </div>
  )
}

export default App