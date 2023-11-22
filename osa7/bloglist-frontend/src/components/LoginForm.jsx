import { useDispatch } from 'react-redux'
import { login } from '../reducers/loginReducer'

const LoginForm = () => {
  const dispatch = useDispatch()

  const logUserIn = (event) => {
    event.preventDefault()
    const loginInfo = {
      username: event.target.Username.value,
      password: event.target.Password.value
    }
    console.log(loginInfo)
    dispatch(login(loginInfo))
  }

  return (
    <div>
      <h2>Log in to blogsapp</h2>
      <form onSubmit={logUserIn}>
        <div>
        username:
          <input
            id='username'
            type="text"
            name="Username"
          />
        </div>
        <div>
        password:
          <input
            id='password'
            type="password"
            name="Password"
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm