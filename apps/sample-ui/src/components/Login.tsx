import { FormEvent } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'
import { IUserProfile, userProfileState } from '../state/userProfile'

function login() {
  return fetch(`${process.env.REACT_APP_API_URL}/login`, { method: 'POST' }).then(res => res.json())
}

const Login = () => {
  const [, setUserProfile] = useRecoilState(userProfileState)

  const loginMutation = useMutation<IUserProfile, Error>(
    'login',
    login,
    {
      onSuccess: (data, _variables, _context) => {
        setUserProfile(data);
      },
    }
  )

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate();
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="username" aria-label="Username" />
      <input type="password" name="password" aria-label="Password" />
      {!loginMutation.isIdle ? 'loading...' : <button type="submit">Login</button>}
    </form>
  )
}

export default Login
