const VxwolServer = require("./vxwol-server");
const VxwolApi = require("./vxwol-api");
const path = require("path");
const Service = require("node-windows").Service;

switch(process.argv[2]){
    case null:
    case undefined:
        start();
        break;
    case '--windows-service':
        createWindowsService();
        break;
    case '--linux-service':
        console.log(process.argv[2] + " option is not supported yet.");
        break;
}

function start(){
    var wolServer = new VxwolServer();

    wolServer.init({
        api: VxwolApi
    });
}

function createWindowsService(){
    var svc = new Service({
        name: "VxWol Service",
        description: "VxWol system service",
        script: path.join(__dirname + "/vxwol.js"),
        nodeOptions: []
    });
    svc.on("install", function() {
        svc.start();
    });

    svc.install();
}




