import { globalShortcut } from 'electron'
import settings from 'electron-settings'
import { createQuickMenuWindow, toggleMainWindow } from './windows'

export function registerGlobalShortcut(): void {
  globalShortcut.unregisterAll()
  const json = settings.getSync('settings') as { [key: string]: string }
  let keys = json?.settingsShorts
  if (keys) {
    globalShortcut.register(keys, toggleMainWindow)
  }
  keys = json?.menusShorts
  if (keys) {
    globalShortcut.register(keys + '', createQuickMenuWindow)
  }
}
