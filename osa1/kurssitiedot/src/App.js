// Otsikon luova komponentti
const Header = (props) => {
  console.log(props)
  return (
    <>
      <h1>{props.header}</h1>
    </>
  )
}

// Sisällön osat luova komponentti
const Part = (props) => {
  console.log(props)
  return (
    <p>{props.desc} {props.count}</p>
  )

}

// Sisällön luova komponentti
const Content = (props) => {
  console.log(props)
  return (
    <>
      <Part desc={props.parts[0].name} count={props.parts[0].exercises}/>
      <Part desc={props.parts[1].name} count={props.parts[1].exercises}/>
      <Part desc={props.parts[2].name} count={props.parts[2].exercises}/>
    </>
    
  )
}

// Komponentti, joka laskee muiden kenttien lukujen yhteismäärän
const Total = (props) => {
  console.log(props)
  return (
    <>
      <p>Number of exercices {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header header={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default App