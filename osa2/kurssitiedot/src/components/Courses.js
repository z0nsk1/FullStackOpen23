import Course from "./Course"

// Mapataan kurssit ja kutsutaan yksitellen kurssi-moduulia
const Courses = ({ courses }) => {
    return (
        <div>
            {courses.map(course =>
            <Course key={course.id} course={course}/>
            )}
        </div>
    )
}

export default Courses