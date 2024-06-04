if (is.dev) {
  app.setPath('userData', app.getPath('userData') + '-dev')
}

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import execMenu from './libs/execMenu'
import settings from 'electron-settings'
import { registerGlobalShortcut } from './libs/globalShortcut'
import createTray from './libs/tray'
import { createMainWindow } from './libs/windows'
import { initialize, errorHandler } from 'electron-log/main'
import { execSync } from 'child_process'
import path from 'path'

initialize()

errorHandler.startCatching({
  showDialog: true,
  onError({ error }) {
    dialog.showMessageBox({
      title: 'An error occurred',
      message: error.message,
      detail: error.stack,
      type: 'error'
    })
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('execMenu', execMenu)
  ipcMain.handle('settings:get', (_e, ...rest) => settings.get(...(rest as [])))
  ipcMain.handle('settings:set', (_e, ...rest) => settings.set(...(rest as [string, string])))
  ipcMain.handle('toggleMainWindow', () => registerGlobalShortcut())
  ipcMain.handle('getLogs', () =>
    execSync(`tail -n 1000 ${path.join(app.getPath('userData'), 'logs/main.log')}`).toString()
  )

  registerGlobalShortcut()
  createTray()

  createMainWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
