const bacnet = require('bacstack');

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
const obj = argv[3];

if (!(obj in objects)) {
  console.log("no such object", obj);
  console.log("supported are:");
  console.log(Object.keys(objects));
  return;
}

// Initialize BACStack
const client = new bacnet({ apduTimeout: 6000 });

switch (cmd) {
  case 'clear':
    {
      let priority = 0;
      for (priority = 0; priority <= 14; priority++)
        client.writeProperty('192.168.200.34', objects[obj], propertyIds.presentValue, [{ type: 4, value: null }], { priority }, (err) => {
          client.readPropertyMultiple('192.168.200.34', [{
            objectId: objects[obj],
            properties: [prop('priorityArray'), prop('objectName')]
          }], (err, value) => {
            console.log('value:', JSON.stringify(value, null, 2));
          });
        });
      break;
    }
  case 'poll':
    {
      setInterval(() => {
        client.readProperty('192.168.200.34', objects[obj], propertyIds.priorityArray, (err, value) => {
          console.log('value: ', JSON.stringify(value.values.map(e => e.value)));//,null, 2));
        });
      }, 1000);
      break;
    }
  case 'enumProps':
    {
      for (let i = 81; i < 123; i++)
        client.readProperty('192.168.200.34', objects[obj], i, (err, value) => {
          if (value)
            console.log(i, JSON.stringify(value.values, null, 2));
        });
      break;
    }
}

// for(let i = 81; i < 123; i++)
//   client.readProperty('192.168.200.34', objects.ventilSet, i, (err, value) => {
//     if(value)
//       console.log(i, JSON.stringify(value.values, null, 2));
//   });


/*client.writeProperty('192.168.200.34', objects.ventilator, propertyIds.presentValue, [{ type: 0, value: null}], { priority: 8 }, (err) => {
  client.readPropertyMultiple('192.168.200.34', [{
    objectId: objects.jalouise,
    properties: [prop('priorityArray'), prop('objectName')]
  }], (err, value) => {
    console.log('value:', JSON.stringify(value, null, 2));
  });
});*/
