import { FormEvent, useState } from 'react'
import { useRecoilState } from 'recoil'
import { IUserProfile, userProfileState } from '../state/userProfile'

function mockLoginRequest(): Promise<{
  status: string
  user: IUserProfile
}> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: 'OK',
        user: {
          username: 'userA',
          permissions: ['AMAZING_ADMIN_PERMISSION'],
        },
      })
    }, 2000)
  })
}

const Login = () => {
  const [, setUserProfile] = useRecoilState(userProfileState)

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsLoading(true)

    const res = await mockLoginRequest()

    if (res.status !== 'OK') {
      setIsLoading(false)
      return
    }

    setUserProfile(res.user)
  }
  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="username" aria-label="Username" />
      <input type="password" name="password" aria-label="Password" />
      {isLoading ? 'loading...' : <button type="submit">Login</button>}
    </form>
  )
}

export default Login
