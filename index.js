var liveServer = require("live-server");

var params = {
    port: 8888,
    host: "127.0.0.1",
    open: true,
    // file: "app/index.html",
    wait: 1000,
    logLevel: 2
};
liveServer.start(params);
