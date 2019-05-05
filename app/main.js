/**
 * Electron Boilerplate
 * 
 * @author Bavamont
 * @link https://github.com/bavamont
 */

const electron = require("electron");
const {app, BrowserWindow, Menu, ipcMain, Tray} = electron;
const {autoUpdater} = require("electron-updater");
const url = require("url");
const path = require("path");
const settings = new(require("./scripts/settings.js"));
const i18n = new(require("./scripts/i18n.js"));
var mainWindow = null;
var exeDirectory = app.getAppPath();
var showFrame = false;

/**
 * Set environment variable NODE_ENV
 */
process.env.NODE_ENV = settings.get("appMode");

/**
 * Disable security warnings
 * https://github.com/electron/electron/issues/12035
 */
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

/**
 * Bug fix
 * https://github.com/electron/electron/issues/6139
 */
if (process.platform === "linux") {
    app.disableHardwareAcceleration();
}

/**
 * Creates the main window
 */
function createMainWindow() {

    /**
     * Check for updates.
     */
    if (process.env.NODE_ENV === "production") { 
        autoUpdater.checkForUpdates();
    }

    /**
     * Added for notifications during development.
     * https://electronjs.org/docs/tutorial/notifications#windows
     */
    if (process.env.NODE_ENV === "development") { 
      app.setAppUserModelId(process.execPath);
      showFrame = true;
    }

    /* Define main window. */
    mainWindow = new BrowserWindow({
      backgroundColor: "#FFF",
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      transparent: false,
      frame: showFrame,
      resizable: false,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        preload: path.join(__dirname, 'preload.js')
      },
      icon: path.join(__dirname, "assets", "app", "icons", "64x64.png")
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "app.html"),
        protocol: "file",
        slashes: true
    }));
    mainWindow.on("ready-to-show", function() {
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send("set-version", app.getVersion());
    });
    /* Event triggered when mainWindow is closed. */
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    var trayIcon = new Tray(path.join(__dirname, "assets", "app", "icon.png"));
    if (process.env.NODE_ENV === "production") { 
      mainWindow.setMenu(null);    
    } else {
      const mainMenu = require("./scripts/menu.js");
      Menu.setApplicationMenu(mainMenu);
      mainWindow.setMenu(mainMenu);
    }
}

/**
 * app Events
 * https://github.com/electron/electron/blob/master/docs/api/app.md 
 *
 * Emitted when Electron has finished initializing.
 */
app.on("ready", () => createMainWindow());

/**
 * Emitted before the application starts closing its windows.
 */
app.on("before-quit", () => {
})

/**
 * Emitted when all windows have been closed.
 */
app.on("window-all-closed", () => {
  app.quit()
})

/**
 * Emitted when the application is activated (macOS).
 */
app.on("activate", () => {
    if (mainWindow === null) {
        createMainWindow();
    }
})

/**
 * Update has been downloaded.
 */
autoUpdater.on("update-downloaded", () => {
  if (process.env.NODE_ENV === "production") { 
    dialog.showMessageBox({
      type: "info",
      title: i18n.__("Update available"),
      message: i18n.__("Do you want to update now?"),
      buttons: [i18n.__("Yes"), i18n.__("No")]
    }, (index) => {
      if (!index) autoUpdater.quitAndInstall(); 
    });
  }
});

/**
 * Toggle maximize window
 */
ipcMain.on('maximize-window', function(event, arg) {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();    
});

/**
 * Minimize window
 */
ipcMain.on('minimize-window', function(event, arg) {
  mainWindow.minimize();    
});

/**
 * Clsoe window
 */
ipcMain.on('close-window', function(event, arg) {
  mainWindow.close();    
});