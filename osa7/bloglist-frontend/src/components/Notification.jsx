import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification)
  // message on nyt luotu välittymään taulukkona, jotta tieto siitä, onko kyseessä statusviesti vai joku muu (virhe). Tämä siksi, että tyylit saadaan oikein
  // ensimmäinen alkio on viesti ja toinen alkio on tieto siitä, millaista viestiä viesti edustaa
  if (message) {
    return (
      <div className={message[1] === 'status' ? 'status' : 'error'}>
        {message[0]}
      </div>
    )
  }
}

export default Notification