import Content from "./Content"

const Header = ({ course }) => <h2>{course}</h2>

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
        </div>
    )
}

export default Course