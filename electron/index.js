const { app, globalShortcut } = require('electron')
const { createWindow } = require('./main')
const { ipcMain } = require('electron')

const createClientListener = (event, callback) =>
  ipcMain.on(event, callback)

createClientListener('popup', (_, url) => createWindow(url, {
  width: 600,
  height: 600,
  titleBarStyle: 'default'
}))

const shortcut = window => (key, event) => globalShortcut.register(key, () => {
  window.webContents.send('shortcut', event)
})

app.on('ready', () => {
  const window = createWindow('http://localhost:3000')

  window.on('focus', () => {
    const register = shortcut(window)

    register('CmdOrCtrl+L', 'address:focus')
    register('CmdOrCtrl+T', 'new:tab')
    // TODO make an option to select keyboard type
    register('CmdOrCtrl+Z', 'remove:tab')
    register('CmdOrCtrl+W', 'history:back')
    register('CmdOrCtrl+Y', 'history:forward')
    register('CmdOrCtrl+Alt+Left', 'tab:left')
    register('CmdOrCtrl+Alt+Right', 'tab:right')
  })

  window.on('blur', () => {
    globalShortcut.unregisterAll()
  })
})

app.on('blur', e => {
  globalShortcut.unregisterAll()
})
