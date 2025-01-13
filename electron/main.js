"use strict";

const { BrowserWindow, app, ipcMain, session } = require("electron");
const { join } = require("path");
const { startServer } = require("next/dist/server/lib/start-server");
const { is } = require("@electron-toolkit/utils");
const getPortPlease = require("get-port-please");

const PORT = "3000";
const IP_ADDRESS = "localhost";

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    // common app window
    // width: 1280,
    // height: 800,
    // wide layout
    width: 1440,
    height: 900,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false, // Allow Node.js APIs in the renderer, 'false' safer
      contextIsolation: true, // Separates the renderer's JS context from the preload script for security
      spellcheck: false, // To disable autofill
    },
  });

  const loadURL = async () => {
    if (is.dev) {
      mainWindow.loadURL(`http://localhost:${PORT}/login`);
    } else {
      try {
        const port = await startNextJSServer();
        console.log("Next.js server started on port:", port);
        mainWindow.loadURL(`http://${IP_ADDRESS}:${port}/login`);
      } catch (error) {
        console.error("Error starting Next.js server:", error);
      }
    }
  };

  loadURL();

  mainWindow.on("ready-to-show", () => mainWindow.show());
  mainWindow.webContents.openDevTools(); // Show Dev Tools

  return mainWindow;
};

const startNextJSServer = async () => {
  try {
    const nextJSPort = await getPortPlease.getPort({
      portRange: [30011, 5000],
    });
    const webDir = join(app.getAppPath(), "app");

    await startServer({
      dir: webDir,
      isDev: false,
      hostname: IP_ADDRESS,
      port: nextJSPort,
      customServer: true,
      allowRetry: false,
      keepAliveTimeout: 5000,
      minimalMode: true,
    });

    return nextJSPort;
  } catch (error) {
    console.error("Error starting Next.js server:", error);
    throw error;
  }
};

app.whenReady().then(() => {
  session.defaultSession.clearCache(() => {
    console.log("Cache cleared");
  });

  createWindow();

  ipcMain.on("ping", () => console.log("pong"));

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught execption:", err);
  app.quit();
});
