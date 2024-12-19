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
__require("dotenv").config();
var PORT = process.env.NEXT_PORT;
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
  let url = `http://localhost:${PORT}`;
  const loadURL = async () => {
    if (process.env.NODE_ENV === "development") {
      mainWindow.loadURL(url);
    } else {
      try {
        const { host, port } = await startNextJSServer();
        console.log("Next.js server started on port:", port);
        url = `http://${host}:${port}`;
        mainWindow.loadURL(`http://${host}:${port}`);
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
    const host = process.env.NEXT_IP_ADDRESS;
    const port = PORT;
    const webDir = join(app.getAppPath(), "app");
    await startServer({
      dir: webDir,
      isDev: false,
      hostname: host,
      port,
      customServer: true,
      allowRetry: false,
      keepAliveTimeout: 5e3,
      minimalMode: true
    });
    return { host, port };
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
