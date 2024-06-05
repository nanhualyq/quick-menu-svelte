import { execSync } from 'child_process'
import { Menu } from '../../types'
import * as anki from './anki'
import * as youdao from './youdao'
import * as utils from './utils'
import { closeMenusWindow } from './windows'
import logs from 'electron-log/main'
import { Notification } from 'electron'
import fs from 'fs'
import { shell } from 'electron'

export function execShell(code: string): string {
  return execSync(code).toString().trim()
}

const context = {
  anki,
  execShell,
  youdao,
  logs,
  Notification,
  fs,
  utils,
  // for open url | file | path, etc.
  shell
}

export default async function execMenu(_e, menu: Menu): Promise<unknown> {
  logs.info('exec menu:', menu.name)
  await closeMenusWindow()
  const f = new Function('context', menu.code)
  await f(context)
  return
}

// An example of menu
// const menus: Menu[] = [
//   {
//     name: 'menu name',
// code: `context.anki.post({
//   action: 'guiAddCards',
//   params: {
//     note: {
//       deckName: 'Default',
//       modelName: '@Basic',
//       fields: {
//         Front: '123'
//       }
//     }
//   }
// })`
//   }
// ]
