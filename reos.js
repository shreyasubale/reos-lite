var util = require('util');
var NobleDevice = require('noble-device');

var SERVICE_UUID          = 'fff0';
var CONTROL_UUID          = 'fff3';
var EFFECT_UUID           = 'fff3';

var ReosLed = function(peripheral) {
  NobleDevice.call(this, peripheral);
};

ReosLed.SCAN_UUIDS = [SERVICE_UUID];

ReosLed.prototype.RGBtoBuffer = function (rgbString) {
  rgbString = rgbString || "000000";
  var fromString =   rgbString
  return Buffer.from(fromString, "hex")

};
ReosLed.is = function(peripheral) {
  /* This is a big no no , return correct info */
  var localName = peripheral.advertisement.localName;
  console.log(localName);
  return true;
  // return ((localName === undefined) || (localName === 'Cnlight') );
};

NobleDevice.Util.inherits(ReosLed, NobleDevice);

ReosLed.prototype.writeServiceStringCharacteristic = function(uuid, string, callback) {
  this.writeStringCharacteristic(SERVICE_UUID, uuid, string, callback);
};

ReosLed.prototype.writeControlCharateristic = function(red, green, blue, brightness, callback) {
  var rgbString = red + green + blue;
  var brightNess = brightness;
  var command = this.RGBtoBuffer(rgbString,brightNess);
  this.writeServiceStringCharacteristic(CONTROL_UUID, command, callback);
};

ReosLed.prototype.turnOn = function(callback) {
  this.writeServiceStringCharacteristic( CONTROL_UUID, this.RGBtoBuffer("0f0d0300ff2b1bd0a00101000000bbffff") ,callback);
};

ReosLed.prototype.turnOff = function(callback) {
  this.writeServiceStringCharacteristic( CONTROL_UUID, this.RGBtoBuffer("0f0a0d000000000005000013ffff") ,callback);
};

ReosLed.prototype.setColorAndBrightness = function(red, green, blue, brightness, callback) {
    function convert(integer) {
        var str = Number(integer).toString(16);
        return str.length == 1 ? "0" + str : str;
    };
  red = convert(red);
  blue = convert(blue);
  green = convert(green);
  brightness = brightness?convert(brightness):"00";

  this.writeControlCharateristic(brightness, red, green, blue, callback);
};

// ReosLed.prototype.setGradualMode = function(on, callback) {
//   this.writeServiceStringCharacteristic(EFFECT_UUID, on ? 'TS' : 'TE', callback);
// };

module.exports = ReosLed;