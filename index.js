const bacnet = require('bacstack');
const { argv } = process;

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

// Define a list of devices and known objects
const devices = {
  delta: {
    ip: '192.168.200.34',
    knownObjects: {
      ventilator: { type: 1, instance: 1206 },
      // add more known objects for device1
    }
  },
  schneider: {
    ip: '192.168.72.23',
    knownObjects: {
      ventilator: { type: 1, instance: 1207 },
      // add more known objects for device2
    }
  },
  // add more devices as necessary
}

const device = devices[argv[2]];
const cmd = argv[3];
let obj;

if (device.knownObjects.hasOwnProperty(argv[4])) {
  obj = device.knownObjects[argv[4]];
} else {
  const objType = parseInt(argv[4]);
  const objInstance = parseInt(argv[5]);

  if (isNaN(objType) || isNaN(objInstance)) {
    console.log("Invalid object type or instance");
    return;
  }

  obj = { type: objType, instance: objInstance };
}

// Initialize BACStack
const client = new bacnet({ apduTimeout: 6000 });

switch (cmd) {
  case 'whois': {
    client.on('iAm', (device) => {
      console.log('address: ', device.address);
      console.log('deviceId: ', device.deviceId);
      console.log('maxAdpu: ', device.maxAdpu);
      console.log('segmentation: ', device.segmentation);
      console.log('vendorId: ', device.vendorId);
      const objectListPropertyId = 76;
      const objectNamePropertyId = 77;
      // for(let i = 0; i < 255; i++)
      client.readProperty(
        device,
        { type: 8, instance: device.deviceId },
        objectListPropertyId,
        (err, value) => {
          value.values.forEach(object => {
            client.readProperty(
              device,
              object.value,
              objectNamePropertyId,
              (err, value) => {
                console.log(value.values[0].value, "@", value.objectId)
              }
            );
          })

        }
      );
    });
    client.whoIs({ address: device });
    break;
  }
  case 'clear':
    {
      let priority = 0;
      for (priority = 0; priority <= 17; priority++)
        client.writeProperty(device, objects[obj], propertyIds.presentValue, [{ type: 0, value: null }], { priority }, (err) => {
          client.readPropertyMultiple(device, [{
            objectId: objects[obj],
            properties: [prop('priorityArray'), prop('objectName')]
          }], (err, value) => {
            console.log('value:', JSON.stringify(value.values[0].values[0].value.map(val => val.value), null, 0));
            client.close()
          });
        });
      break;
    }
  case 'poll':
    {
      setInterval(() => {
        client.readProperty(device, objects[obj], propertyIds.priorityArray, (err, value) => {
          console.log('value: ', JSON.stringify(value.values.map(e => e.value)));//,null, 2));
        });
      }, 1000);
      break;
    }
  case 'enumProps':
    {
      for (let i = 81; i < 123; i++)
        client.readProperty(device, objects[obj], i, (err, value) => {
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
