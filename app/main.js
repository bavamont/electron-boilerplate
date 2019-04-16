/**
 * Electron boilerplate
 * 
 * @author Bavamont
 * @link https://github.com/bavamont
 */

const electron = require("electron");
const {app, BrowserWindow, Menu, ipcMain} = electron;
const url = require("url");
const path = require("path");
const settings = new(require("./scripts/settings.js"));
let mainWindow = null;

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
	/* Define main window. */
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		titleBarStyle: "hidden",
		useContentSize: true,
		resizable: false,
        show: false,
        backgroundColor: '#FFF',
        webPreferences: {
        	nodeIntegration: true
        }
  	});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "main.html"),
        protocol: "file",
        slashes: true
    }));
    mainWindow.on('ready-to-show', function() {
        mainWindow.show();
        mainWindow.focus();
    });
    /* Event triggered when mainWindow is closed. */
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
    const mainMenu = require("./scripts/menu.js");
    Menu.setApplicationMenu(mainMenu);
    mainWindow.setMenu(mainMenu);
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