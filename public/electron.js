// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");

let mainWindow;
let log;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nativeWindowOpen: true,
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: __dirname + "/preload.js",
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL("https://skilltrackz.com/");

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
    log = require("electron-log");
    log.transports.file.level = "debug";
    autoUpdater.logger = log;
  } else {
    log = require("electron-log");
    log.transports.file.level = "error";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

ipcMain.on("toMain", (event, arg) => {
  if (arg === "start-install") {
    autoUpdater.quitAndInstall();
    setTimeout(() => {
      app.exit(0);
    }, 2000);
  } else if (arg === "close-app") {
    app.exit(0);
  } else if (arg === "minimize-app") {
    mainWindow.minimize();
  } else if (arg === "maximize-app") {
    mainWindow.maximize();
  }
});

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send("fromMain", text);
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("checking-for-update");
});
autoUpdater.on("update-available", (info) => {
  sendStatusToWindow("update-available");
});
autoUpdater.on("update-not-available", (info) => {
  sendStatusToWindow("update-not-available");
});
autoUpdater.on("error", (err) => {
  sendStatusToWindow("error");
});
autoUpdater.on("download-progress", (progressObj) => {
  sendStatusToWindow({ speed: progressObj.bytesPerSecond, percent: progressObj.percent, transferred: progressObj.transferred, total: progressObj.total });
});
autoUpdater.on("update-downloaded", (info) => {
  sendStatusToWindow("update-downloaded");
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
