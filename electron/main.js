const { BrowserWindow, app, ipcMain, session } = require("electron");
const { join } = require("path");
const { startServer } = require("next/dist/server/lib/start-server");
require("dotenv").config();

const PORT = process.env.NEXT_PORT;

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
    },
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
  mainWindow.webContents.openDevTools(); // Show Dev Tools

  return mainWindow;
};

const startNextJSServer = async () => {
  try {
    // TODO: use a dynamic port for sub app
    const host = process.env.NEXT_IP_ADDRESS;
    const port = PORT;
    const webDir = join(app.getAppPath(), "app");

    await startServer({
      dir: webDir,
      isDev: false,
      hostname: host,
      port: port,
      customServer: true,
      allowRetry: false,
      keepAliveTimeout: 5000,
      minimalMode: true,
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
