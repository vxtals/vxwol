const fs = require("fs");

function VxwolData(filePath, callback, callbackErr) {
  this.filePath = filePath;
  this.devices = [];
  let fileContent;
  fs.readFile(this.filePath, "utf8", (err, devicesData) => {
    if (err) {
      console.log("[VxwolData]: Devices file does not exist");
    } else {
      this.parseDevices(devicesData, callback, callbackErr);
    }
  });
}

VxwolData.prototype.getDevices = getDevices;
VxwolData.prototype.addDevice = addDevice;
VxwolData.prototype.removeDevice = removeDevice;
VxwolData.prototype.parseDevices = parseDevices;
VxwolData.prototype.writeDevicesToFile = writeDevicesToFile;

function getDevices () {
    return this.devices;
}

function addDevice(device, callback, callbackErr) {
    const self = this; 
    let found = false;
    if (self.devices.length < 1){
        self.devices.push(device);
        this.writeDevicesToFile(callback);
    }else{
        for (index in self.devices) {
            if (device.mac == self.devices[index].mac) found = true;
            if (index == self.devices.length - 1 && !found) {
                self.devices.push(device);
                this.writeDevicesToFile(callback);
            } else {
                callbackErr();
            }
        }
    }
}

function removeDevice(macAddress, callback, callbackErr) {
  const self = this; 
  for (index in self.devices) {
    if (macAddress.trim() == self.devices[index].mac.trim()) self.devices.splice(index, 1);
    if (index >= self.devices.length - 1){
        this.writeDevicesToFile(callback, callbackErr);
    } 
  }
}

function parseDevices(devicesData, callback, callbackErr) {
  const self = this; 
  let lines = devicesData.split("\r\n");
  if (lines.length < 2 && lines[0].length < 19) {
    // Minimun device line length
    console.log("[VxwolData]: No valid devices found.");
    callback();
  } else {
    console.log("[VxwolData]Loading " + lines.length + " devices:");
    for (index in lines) {
      let parsedLine = lines[index].split(",");
      if (parsedLine.length === 2) {
        console.log("--- " + lines[index]);
        self.devices.push({ name: parsedLine[0], mac: parsedLine[1] });
      }
      if (index == lines.length - 1) this.writeDevicesToFile(callback, callbackErr);
    }
  }
}

function writeDevicesToFile(callback, callbackErr) {
    const self = this;
    fs.open(self.filePath, "w+", (error, fd) => {
        if(error){
            callbackErr();
            return;
        }
        if(self.devices.length < 1){
            fs.write(fd, '', null, "utf8", () => {
                fs.close(fd, callback);
            });
        }else{
            for (index in self.devices) {
                let deviceLine = self.devices[index].name + "," + self.devices[index].mac + "\r";
                fs.write(fd, deviceLine, null, "utf8", () => {
                    if (index == self.devices.length - 1) fs.close(fd, callback);
                });
            }
        }
    });
}

module.exports = VxwolData;
