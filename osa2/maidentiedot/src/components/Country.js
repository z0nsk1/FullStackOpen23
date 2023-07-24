const Country = ({ country }) => {
    if (country !== null){
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p> 
        <p>Area {country.area}</p>
        <h3>Languages: </h3>
        <ul>
          {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <img src={country.flags.png} alt="flag" border="1px black" width="30%" height="30%"/>
      </div>
    )}
  }

  export default Country