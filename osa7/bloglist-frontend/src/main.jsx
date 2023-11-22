import ReactDOM from 'react-dom/client'
import App from './App'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'

// Konfiguroidaan store ja sen reducerit
const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer
  }
})

// Käytetään Provideria tilan jakamiseen App:lle ja sen alikomponenteille
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)