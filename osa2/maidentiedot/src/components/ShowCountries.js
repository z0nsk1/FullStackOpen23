import Country from "./Country"

const ShowCountries = ({ countries }) => {
    if(countries !== null) { 
    console.log('Countries-parameter contains: ', countries, ' and its type is: ', typeof countries)
    if (countries.length > 10) {
      return (<p>Too many matches, improve filter</p>)
    }
    else if (countries.length === 1) {
      return(<Country country={countries[0]}/>)
    }
    else {
      return(
        <div>
          {countries.map((maa, i) => <p key={i}>{maa.name.common} <button>show</button></p>)}
        </div>
      )
    }
    }
}

export default ShowCountries