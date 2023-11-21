/* eslint-disable react/prop-types */
import { useReducer, createContext, useContext } from "react"

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'STATUS':
      return action.payload
    case 'ERROR':
      return 'Error: ' + action.payload
    default:
      return state
  }
}

const NotificationContext = createContext() // Luodaan konteksti Reactin hookilla createContext
// Konteksti on ns. globaalin tila, johon mille tahansa komponentille on mahdollista antaa suora pääsy
// Kontekstin avulla esim. dispatcheria ei tarvitse välittää komponenteille, jotka eivät sitä tarvitse

// Ilmoituksen kontekstin tarjoaja, joka exportataan
export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, 'do something...')
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <h3>Anecdote app</h3>
      <div style={style}>
        {notification}
      </div>
      {props.children} {/* Koska main.jsx tiedostossa koko App on NotificationContextProvider:n sisällä, tulee tälle propsina App:n ja sen alikomponenttien palauttama data, jotta ne saadaan näkyviin, pitää ne tulostaa tässä*/}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const NotificationAndDispatch = useContext(NotificationContext)
  return NotificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const NotificationAndDispatch = useContext(NotificationContext)
  return NotificationAndDispatch[1]
}

export default NotificationContext
