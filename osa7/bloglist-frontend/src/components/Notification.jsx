import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification)
  console.log(message)
  if (message) {
    return (
      <div className={message[1] === 'status' ? 'status' : 'error'}>
        {message[0]}
      </div>
    )
  }
}

export default Notification