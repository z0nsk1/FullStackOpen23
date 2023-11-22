import { useState } from 'react'

// Tämä on custom hook, joka nopeuttaa ja lyhentää input-fieldin käyttöä
// useField saa parametriksi typen, eli input-field:n tyypin. useField palauttaa tyypin, input-field:n metodin onChange ja input-field:n arvon eli valuen (ks. input-field dokumentaatio)
// useField palauttaa myös funktion reset, joka ei kuuluu input-tagille ja aiheuttaisikin virheen, mutta App:ssa on ns. irroitettu reset funktio paluuarvosta, jotta se ei päädy input-kentälle
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => { setValue('') }

  return {
    type,
    value,
    onChange,
    reset
  }
}