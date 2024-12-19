'use strict';

var electron = require('electron');

// electron/preload.js
electron.contextBridge.exposeInMainWorld("api", {
  ping: () => electron.ipcRenderer.send("ping")
});
