import { useEffect, useState } from 'react'
const jsondiffpatch = require('jsondiffpatch')
import styles from './MockDashBoard.module.css'

export interface IRecordedResponse {
  name: string
  originalResponse: any
}

enum MockStatus {
  notReady = 'notReady',
  notRecorded = 'notRecorded',
  noMockFile = 'noMockFile',
  inSync = 'inSync',
  outOfSync = 'outOfSync',
}

export const LOCAL_STORAGE_KEY = 'bleublanc_recorder'

function parseStatus(currentMock: any, newMock: any): MockStatus {
  if (!currentMock) return MockStatus.noMockFile
  if (!newMock) return MockStatus.notRecorded
  const delta = jsondiffpatch.diff(currentMock, newMock)
  if (!delta) return MockStatus.inSync
  return MockStatus.outOfSync
}

const MockDashboard = () => {
  const [handler, setHandle] = useState<FileSystemDirectoryHandle | null>(null)
  const [contents, setFileContents] = useState<any[]>([])

  const handleMessage = (e: MessageEvent) => {
    console.log('message:', e)
    const data = e.data?.data
    if (e.data?.event !== 'bleublanc_response_update') return
    const savedResponses = localStorage.getItem(LOCAL_STORAGE_KEY)
    const currentResponses: IRecordedResponse[] = savedResponses
      ? JSON.parse(savedResponses)
      : []
    const index = currentResponses.findIndex(r => r.name === data.name)
    if (index > -1) {
      currentResponses.splice(index, 1)
    }
    currentResponses.push(data)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentResponses))
    console.log('recorded mock response update for:', data)
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  if (typeof localStorage === 'undefined') return null

  const lsItems = localStorage.getItem('bleublanc_recorder')
  const requests: IRecordedResponse[] = lsItems ? JSON.parse(lsItems) : []
  const getFileContent = async (
    name: string,
    handler: FileSystemDirectoryHandle | null
  ) => {
    let fileContent = null
    try {
      const file = await handler?.getFileHandle(`${name}.json`)
      if (file) {
        const f = await file.getFile()
        const content = await f.text()
        fileContent = content ? JSON.parse(content) : null
      }
    } catch (error) {
      console.error(error)
    }

    return fileContent
  }

  const upsertMock = async (res: IRecordedResponse) => {
    if (!handler) return
    const newFileHandle = await handler.getFileHandle(`${res.name}.json`, {
      create: true,
    })
    const wh = await newFileHandle.createWritable()
    try {
      await wh.write(JSON.stringify(res.originalResponse))
    } catch (error) {
      console.error(error)
    } finally {
      wh.close()
      setTimeout(() => {
        updateFileContrents(handler)
      }, 1000)
    }
  }

  const deleteMock = async (name: string) => {
    await handler?.removeEntry(`${name}.json`)
    await updateFileContrents(handler)
  }

  const updateFileContrents = async (
    handler: FileSystemDirectoryHandle | null
  ) => {
    if (!handler) return MockStatus.notReady
    const contents = await Promise.all(
      requests.map(async r => {
        return await getFileContent(r.name, handler)
      })
    )
    setFileContents(contents)
  }

  return (
    <main className={styles.app}>
      <h1>🔧 Mock Manangement Tool</h1>
      <div className={styles.wrapper}>
        <section className={styles.col}>
          {handler && <div>Mock folder root: {handler.name}</div>}
          <button
            onClick={async () => {
              try {
                const dirHandle = await window.showDirectoryPicker({
                  title: 'Select mock json folder root',
                })
                await dirHandle.requestPermission({
                  mode: 'readwrite',
                })
                setHandle(dirHandle)
                await updateFileContrents(dirHandle)
              } catch (error) {
                console.error(error);
              }
            }}
          >
            {handler ? 'Update' : 'Select'} mock directory
          </button>
          {'   '}
          <button onClick={() => updateFileContrents(handler)}>
            Refresh Table
          </button>
          <br />
          <br />
          <br />
          <table className={styles.mocklists}>
            <tbody>
              <tr>
                <th>Request Name</th>
                <th>API Response</th>
                <th>Mock File</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              {requests.map((r, i) => {
                const content = contents.length > i ? contents[i] : null
                const status = handler
                  ? parseStatus(content, r.originalResponse)
                  : MockStatus.notReady
                return (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td>{JSON.stringify(r.originalResponse)}</td>
                    <td>{JSON.stringify(content)}</td>
                    <td>{status}</td>
                    <td>
                      {status === MockStatus.noMockFile && (
                        <button onClick={() => upsertMock(r)}>Add mock</button>
                      )}
                      {status === MockStatus.outOfSync && (
                        <button onClick={() => upsertMock(r)}>
                          Update mock
                        </button>
                      )}
                      {[
                        MockStatus.inSync,
                        MockStatus.notRecorded,
                        MockStatus.outOfSync,
                      ].includes(status) && (
                        <button onClick={() => deleteMock(r.name)}>
                          Delete Mock
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
        <section className="col">
          <iframe className={styles.uiframe} src={process.env.NEXT_PUBLIC_UI_URL} />
        </section>
      </div>
    </main>
  )
}

export default MockDashboard
