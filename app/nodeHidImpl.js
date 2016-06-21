const LED_PIN = 13; // Built-in LED
const LED_INTERVAL = 1000; // Every second
const BUFFER_OFFSET = 2; // The buffer offset containing codes

var Five = require("johnny-five");
var Edison = require("edison-io");
var HID = require('node-hid');
const PunyCode = require('punycode');

const hidMap = {
		4:"A", 5:"B",6:"C",7:"D",8:"E",
		9:"F", 10:"G", 11:"H",12:"I",13:"J",
		14:"K",15:"L",16:"M",17:"N", 18:"O",
		19:"P",20:"Q",21:"R",22:"S",23:"T",
		24:"U",25:"V", 26:"W", 27:"X", 28:"Y",
		29:"Z",30: '1', 31: '2', 32: '3', 33: '4',
		34: '5',35: '6', 36: '7', 37: '8', 38: '9',
		// enter - barcode escape char
		39: '0',40: 'enter',44:" ",45:"-", 55:".", 56:"/",
		85:"*", 87:"+"
		};
var board = new Five.Board({
		io: new Edison()
});

var toAscii = function(code) {
	if(code == undefined) {
		return undefined;
	}
	return code - 4 + 'A';
}
board.on("ready", function() {
  console.log("Ready!");
  // Blink to signal program start
  var led = new Five.Led(LED_PIN);
  led.blink(LED_INTERVAL);
  
  // check the devices
  var devices = HID.devices();
  if(devices == null) {
	  console.log("Devices is null");
	  return;
  }
  console.log("Printing device info..." + devices);
  var i = 0;
  for(i = 0; i < devices.length; i++) {
	  var device = devices[i];
	  console.log("\tvendorId:" + device.vendorId);
	  console.log("\tmanufacturer: " + device.manufacturer)
	  console.log("\tproductId: " + device.productId);
	  console.log("\tproduct: " + device.product);
	  console.log("\tpath: " + device.path);
	  if(device.path == null) {
		  console.log("Device is null");
		  continue;
	  }
	  // Open the device
	  var openDevice = new HID.HID(device.path);
	  if(openDevice == null) {
		  console.log("Could not open the device with path: " + device.path);
		  continue;
	  }
	  var buffer = "";
	  var count = 0;
	  openDevice.on("data", function(chunk) {
//		  const descriptor = "\tVendorId: " + device.vendorId() + ",Manufacturer: " + device.manufacturer
//		  	+ ",ProductId: "+device.productId + ",Product: " + device.product + ", Path: " + device.path;
//		  console.log("chunk.length: " + chunk.length);

//		  console.log("chunk.toString(ascii,2): " + chunk.toString("ascii", BUFFER_OFFSET));
		  console.log("chunk.toJSON(): " + chunk.toJSON());
		  var charCode = chunk[BUFFER_OFFSET];
//		  console.log("charCode: " + charCode);
		  var char = hidMap[charCode];
		  if(char == undefined) {
			  // Undefined character
//			  console.log("encountered undefined charCode: " + charCode);
			  return;
		  }
		  if(charCode === 40) {
			  // End of buffer
			  console.log("buffer: " + buffer);
			  buffer = "";
			  return;
		  }
		  // Add the char to the buffer
//		  console.log("char: " + char);
		  buffer += char;
	  });
	  openDevice.on("error", function(err) {
//		  const descriptor = "\tVendorId: " + device.vendorId() + ",Manufacturer: " + device.manufacturer
//		  	+ ",ProductId: "+device.productId + ",Product: " + device.product + ", Path: " + device.path;
		  console.log("Error reading data: " + err);
		  process.exit(1);
	  });
  }
});
