import { verbose } from 'electron-log'
import settings from 'electron-settings'

export async function post(ankiBody = {}): Promise<unknown> {
  verbose('anki post', ankiBody)
  const ankiConnectHost =
    settings.getSync('settings.ankiHost') || import.meta.env.VITE_ANKI_DEFAULT_HOST
  return fetch(ankiConnectHost + '', {
    method: 'POST',
    body: JSON.stringify({
      version: 6,
      ...ankiBody
    })
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw Error(res.error)
      } else {
        return res
      }
    })
}
