const bacnet = require('bacstack');

// Initialize BACStack
const client = new bacnet({apduTimeout: 6000});

const propertyIds = {
  objectName: 77,
  presentValue: 85,
  priorityArray: 87
}

const prop = (name) => {
  return {
    id: propertyIds[name]
  }
}

const objects = {
  ventilSet: {type: 1, instance: 1207},
  ventilGet: {type: 0, instance: 1208},
}

// Read Device Object
const requestArray = [{
  objectId: objects.ventilSet,
  properties: [prop('priorityArray'), prop('objectName')]
}];
client.readPropertyMultiple('192.168.200.34', requestArray, (err, value) => {
  console.log('value: ', JSON.stringify(value, null, 2));
});

setInterval(() => {
  client.readProperty('192.168.200.34', objects.ventilGet, prop('presentValue'), (err, value) => {
    console.log('value: ', JSON.stringify(value, null, 2));
  });
}, 1000);
