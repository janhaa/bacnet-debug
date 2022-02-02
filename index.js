const bacnet = require('bacstack');

// Initialize BACStack
const client = new bacnet({apduTimeout: 6000});

// Discover Devices
/*client.on('iAm', (device) => {
  console.log('address: ', device.address);
  console.log('deviceId: ', device.deviceId);
  console.log('maxApdu: ', device.maxApdu);
  console.log('segmentation: ', device.segmentation);
  console.log('vendorId: ', device.vendorId);
});*/
// client.whoIs();

// Read Device Object
const requestArray = [{
  objectId: {type: 1, instance: 1207},
  properties: [{id: 87}]
}];
client.readPropertyMultiple('192.168.200.34', requestArray, (err, value) => {
  console.log('value: ', JSON.stringify(value, null, 2));
});
