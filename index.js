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
  ventilator: { type: 1, instance: 1206 },
  ventilSet: { type: 1, instance: 1207 },
  ventilGet: { type: 0, instance: 1208 },
  jalouise: { type: 2, instance: 1401002 }
}

const { argv } = process;

console.log(argv);

const cmd = argv[2];
const dev = argv[3];

// modify device
let priority = 0;
for(priority = 0; priority <= 13; priority++)
client.writeProperty('192.168.200.34', objects.ventilSet, propertyIds.presentValue, [{ type: 4, value: null}], { priority }, (err) => {
   client.readPropertyMultiple('192.168.200.34', [{
     objectId: objects.ventilSet,
     properties: [prop('priorityArray'), prop('objectName')]
   }], (err, value) => {
     console.log('value:', JSON.stringify(value, null, 2));
   });
});

// for(let i = 81; i < 123; i++)
//   client.readProperty('192.168.200.34', objects.ventilSet, i, (err, value) => {
//     if(value)
//       console.log(i, JSON.stringify(value.values, null, 2));
//   });

// read presentValue every second
setInterval(() => {
  client.readProperty('192.168.200.34', objects.ventilator, propertyIds.priorityArray, (err, value) => {
    console.log('value: ', JSON.stringify(value.values.map(e => e.value)));//,null, 2));
  });
}, 1000);

/*client.writeProperty('192.168.200.34', objects.ventilator, propertyIds.presentValue, [{ type: 0, value: null}], { priority: 8 }, (err) => {
  client.readPropertyMultiple('192.168.200.34', [{
    objectId: objects.jalouise,
    properties: [prop('priorityArray'), prop('objectName')]
  }], (err, value) => {
    console.log('value:', JSON.stringify(value, null, 2));
  });
});*/
