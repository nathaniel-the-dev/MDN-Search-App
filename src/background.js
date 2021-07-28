'use strict';

import path from 'path';
import { app, protocol, BrowserWindow, globalShortcut } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';

let mainWindow;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Check for updates
const updater = require('update-electron-app');
updater({ updateInterval: '1 hour', logger: require('electron-log') });

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

function initializeShortcuts() {
	// Toggle windows
	globalShortcut.register('Alt+Shift+S', () => {
		mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
	});

	globalShortcut.register('Alt+Shift+C',()=>{
		mainWindow.close();
	})
}

async function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		backgroundColor: '#0000000',
		minWidth: 800,
		minHeight: 600,
		icon: path.join(__static, 'favicon.ico'),

		show: false,
		autoHideMenuBar: true,

		webPreferences: {
			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,

			devTools: isDevelopment,
		},
	});

	// Load file
	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
	} else {
		createProtocol('app');
		// Load the index.html when not in development
		mainWindow.loadURL('app://./index.html');
	}

	// Init shortcuts
	initializeShortcuts();

	// Show window when contents are loaded
	mainWindow.maximize();
	mainWindow.on('ready-to-show', mainWindow.show);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS3_DEVTOOLS);
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString());
		}
	}
	createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit();
			}
		});
	} else {
		process.on('SIGTERM', () => {
			app.quit();
		});
	}
}