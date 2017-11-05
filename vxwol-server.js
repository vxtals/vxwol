const express = require("express");
const bodyParser = require("body-parser");


function VxwolServer(name){
    this.options = {
        name: !!name ? name : 'VxwolServer'
    }
    this.expressServer = express();
    this.expressServer.use(bodyParser.json()); // to support JSON-encoded bodies
    this.expressServer.use(bodyParser.urlencoded({
       extended: true
     })); 
}

VxwolServer.prototype.init = init;

function init(options, callback, callbackErr) {
    const self = this;
    const api = new options.api(self, "./devices.vwol");

    if(!options){
        console.error('A options object must be provided.')
        if(!!callbackErr) callbackErr();
        return;
    }
    if (!options.api) {
      console.error("API factory must be provided through options.api property.");
      if (!!callbackErr) callbackErr();
      return;
    }
    if(!options.port){
        options.port = 3030;
    }

    self.expressServer.listen(options.port, function() {
        console.log(self.options.name + " listening on port " + options.port);
        if(!!callback) callback();
    });
};

module.exports = VxwolServer;


