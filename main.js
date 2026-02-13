const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    },
    icon: __dirname + '/images/Character.png' // Dein Icon
  });

  win.loadFile('index.html');
  // win.setMenu(null); // Optional: Menüleiste oben entfernen
}

app.whenReady().then(createWindow);