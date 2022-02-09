import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { userProfileState } from '../state/userProfile'

/**
 * 1) login (2 accounts)
 * 2) after login, show a button
 * 3) user A will get a success
 * 4) user B will fail
 */

function getMagicItems() {
  return fetch('http://localhost:4001/magicitems').then(res => res.json())
}

const Main = () => {
  const userProfile = useRecoilValue(userProfileState)

  const magicItemsQuery = useQuery<string[], Error>(
    'magicItems',
    getMagicItems,
    {
      enabled: false,
    }
  )

  return (
    <>
      <span>heyllo, {userProfile.username}</span>

      <div>
        {magicItemsQuery.isFetching ? (
          <span>Loading...</span>
        ) : (
          <button
            onClick={() => {
              magicItemsQuery.refetch()
            }}
          >
            Get Magic Items From API!
          </button>
        )}
      </div>

      {magicItemsQuery.error && (
        <span>{`An error has occurred: ${magicItemsQuery.error.message}`}</span>
      )}

      {!magicItemsQuery.isFetching && magicItemsQuery.data?.length === 0 ? (
        <span>nothing but us chickens</span>
      ) : (
        <ol>
          {magicItemsQuery.data?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      )}
    </>
  )
}

export default Main
