// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const { app, shell, BrowserWindow, screen: electronScreen } = require('electron')


const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: electronScreen.getPrimaryDisplay().workArea.width * 0.8,
    height: electronScreen.getPrimaryDisplay().workArea.height * 0.8,
    show: false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true
    },
  })
  const startURL = 'http://localhost:3000'

  mainWindow.loadURL(startURL)

  mainWindow.once('ready-to-show', () => mainWindow.show())

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  var handleRedirect = (e, url) => {
    if(url != mainWindow.webContents.getURL()) {
      e.preventDefault()
      shell.openExternal(url)
    }
  }
  
  mainWindow.webContents.on('will-navigate', handleRedirect)
  mainWindow.webContents.on('new-window', handleRedirect)
  
}



app.whenReady().then(() => {
  createMainWindow()

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // eslint-disable-next-line no-undef
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
