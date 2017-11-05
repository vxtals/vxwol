const path = require("path");
const wol = require('node-wol');
const VxwolData = require('./vxwol-data');

let devices = [];

function VxwolApi(server, filePath){
    this.server = server;
    this.dataHandler = new VxwolData(filePath, () => {
        this.loadApi(server);
    }, () => {
        console.log('[VxwolApi] Could not access program data. Program will exit now.');
        process.exit(-1);
    })
}

VxwolApi.prototype.loadApi = loadApi;

function loadApi(server){
    const self = this;
    server.expressServer.get("/panel", function(req, res) {
      res.sendFile(path.join(__dirname + "/index.html"));
    });

    server.expressServer.get("/devices", function(req, res) {
      res.send(self.dataHandler.getDevices());
    });

    server.expressServer.post("/devices", function(req, res) {
        let body = req.body;
        if(!!req.body.name && !!req.body.mac){
            self.dataHandler.addDevice(req.body, () => {
                res.status(200).send("Device was properly added to database.");
            }, () => {
                res.status(400).send("Device is already present in the list.");
            })
        }else{
            res.status(400).send("There is a problem with the system. Try again later.");
        }
    });

    server.expressServer.put("/devices/:macAddress", function(req, res) {
        let macAddress = req.params.macAddress;
        //TODO: check MAC is valid
        wol.wake(macAddress, function(error) {
          if (error) {
            console.log('It was not possible to send a WOL packet to ' + macAddress);
            res.status(418).send('Selected device is a teapot.');
            return;
          }else{
              console.log("WOL sent");
              res.status(200).send();
          }
        });
    });

    server.expressServer.delete("/devices/:macAddress", function(req, res) {
      let macAddress = req.params.macAddress;
      self.dataHandler.removeDevice(macAddress, () => {
          res.status(200).send();
      }, () => {
          res.status(500).send();
      });
    });
}

module.exports = VxwolApi;