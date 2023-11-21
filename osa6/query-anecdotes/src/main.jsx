import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { NotificationContextProvider } from './components/Notification'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  // Notification kontekstin tarjoaja käyttöön koko sovelluksessa
  <NotificationContextProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </NotificationContextProvider>
)