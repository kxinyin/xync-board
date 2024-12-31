'use strict';

var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// electron/main.js
var { BrowserWindow, app, ipcMain, session } = __require("electron");
var { join } = __require("path");
var { startServer } = __require("next/dist/server/lib/start-server");
var { is } = __require("@electron-toolkit/utils");
var getPortPlease = __require("get-port-please");
var IP_ADDRESS = "192.168.1.154";
var PORT = "3000";
var createWindow = async () => {
  const mainWindow = new BrowserWindow({
    // common app window
    // width: 1280,
    // height: 800,
    // wide layout
    width: 1440,
    height: 900,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      // Allow Node.js APIs in the renderer, 'false' safer
      contextIsolation: true
      // Separates the renderer's JS context from the preload script for security
    }
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
  mainWindow.webContents.openDevTools();
  return mainWindow;
};
var startNextJSServer = async () => {
  try {
    const nextJSPort = await getPortPlease.getPort({
      portRange: [30011, 5e3]
    });
    const webDir = join(app.getAppPath(), "app");
    await startServer({
      dir: webDir,
      isDev: false,
      hostname: IP_ADDRESS,
      port: nextJSPort,
      customServer: true,
      allowRetry: false,
      keepAliveTimeout: 5e3,
      minimalMode: true
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
