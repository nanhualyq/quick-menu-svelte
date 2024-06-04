import { BrowserWindow, screen, shell } from 'electron'
import { getTrayIcon } from './tray'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import settings from 'electron-settings'

function createWindow(options: Electron.BrowserWindowConstructorOptions = {}) {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon: getTrayIcon() } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    ...options
  })
  return mainWindow
}

function loadHtmlWithHash(window: Electron.BrowserWindow, hash = '') {
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'] + (hash ? `#${hash}` : ''))
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'), { hash })
  }
}

let mainWindow
export function createMainWindow() {
  mainWindow = createWindow({ show: false })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  loadHtmlWithHash(mainWindow)
}

export function toggleMainWindow(): void {
  if (!mainWindow) {
    return
  }
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
  }
}

const SIZE_KEY = 'quick-menu-window-size'
let menusWindow: BrowserWindow | null
export function createQuickMenuWindow(): BrowserWindow | undefined {
  if (menusWindow) {
    return menusWindow
  }
  if (!mainWindow) {
    return
  }
  const lastSize = (settings.getSync(SIZE_KEY) as object) || {}
  const win = createWindow({
    ...lastSize,
    show: false,
    frame: false,
    modal: true,
    alwaysOnTop: true,
    useContentSize: true,
    parent: mainWindow
  })
  menusWindow = win
  loadHtmlWithHash(win, 'menus')

  const [width, height] = win.getSize()
  const { x, y } = screen.getCursorScreenPoint()
  const displaySize = screen.getDisplayNearestPoint({ x, y }).size
  const xPos = x < displaySize.width / 2 ? x : x - width
  const yPos = y < displaySize.height / 2 ? y : y - height
  win.setBounds({ x: xPos, y: yPos })
  win.show()

  win.on('close', () => {
    if (win) {
      const [width, height] = win.getSize()
      settings.set(SIZE_KEY, { width, height })
    }
  })
  win.on('closed', () => {
    menusWindow = null
  })

  win.on('blur', () => {
    win?.close()
  })

  return win
}

export async function closeMenusWindow() {
  if (!menusWindow) {
    return
  }
  menusWindow.close()
  await new Promise((resolve) => {
    menusWindow?.on('closed', () => {
      setTimeout(resolve, 100)
    })
  })
}
