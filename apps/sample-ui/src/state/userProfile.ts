import { atom } from 'recoil'

export interface IUserProfile {
  username: string
  permissions?: string[]
}

const initialUserProfileState: Partial<IUserProfile> = {}

export const userProfileState = atom({
  key: 'userProfile',
  default: initialUserProfileState,
})
