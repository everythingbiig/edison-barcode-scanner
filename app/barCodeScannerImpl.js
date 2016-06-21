var LED_PIN = 13; // Built-in LED
var LED_INTERVAL = 1000; // Every second
const VENDOR_ID = 1035;
var Five = require("johnny-five");
var Edison = require("edison-io");
var usbScanner = require('node-usb-barcode-scanner').usbScanner;
var getDevices = require('node-usb-barcode-scanner').getDevices;

var board = new Five.Board({
		io: new Edison()
});

board.on("ready", function() {
  console.log("Ready!");
  // Blink to signal program start
  var led = new Five.Led(LED_PIN);
  led.blink(LED_INTERVAL);
//get array of attached HID devices 
  var connectedHidDevices = getDevices()
   
  //print devices 
  console.log(connectedHidDevices)
   
  //initialize new usbScanner - takes optional parmeters vendorId and hidMap - check source for details 
  var scanner = new usbScanner({"vendorId":VENDOR_ID});
  console.log("Scanner:");
  console.log(scanner);
  //scanner emits a data event once a barcode has been read and parsed 
  scanner.on("data", function(code){
  	console.log("recieved code : " + code);
  });
});
