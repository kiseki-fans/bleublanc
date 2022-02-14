import './App.css'
import { useRecoilValue } from 'recoil'
import Login from './components/Login'
import Main from './components/Main'
import { userProfileState } from './state/userProfile'

function App() {
  const userProfile = useRecoilValue(userProfileState)

  const isAuth = Object.keys(userProfile).length !== 0

  return (
    <div className="App">
      <header className="App-header">{isAuth ? <Main /> : <Login />}</header>
    </div>
  )
}

export default App
