const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Total = ({ parts }) => {
    // Reduce käy taulukon (tässä tapauksessa olion) läpi askel askeleelta ja laskee yhteen nykyisen
    // ja edellisen alkion arvon ja summa jää prev muuttujaan. 
    // prev on tässä edellinen arvo (akkumulaattori) ja key toimii indeksinä eli prev+1
    // reducen viimeinen 0 on funktion lähtöarvo tai alustus, eli vastaavasti loopilla tehtäessä 
    // kirjotettaisiin let sum = 0
    let sum = Object.keys(parts).reduce((prev, key) => {
        return (prev + parts[key].exercises)
    }, 0)
    return (
        <h3>total of {sum} exercises</h3>
    )
}
const Content = ({ parts }) => {
    console.log(parts.map(part => part.name))
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part}/>
            )}
            <Total parts={parts}/>
        </div>
    )
}

export default Content