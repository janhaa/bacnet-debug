const bacnet = require('bacstack');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

console.log(argv);

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

const device = devices[argv.device];
const cmd = argv.cmd;
const propName = argv.prop;
const objName = argv.objName;
const objType = argv.objType;
const objInstance = argv.objInstance;
const value = argv.value;
const valueType = argv.valueType;
let obj;

if(["write", "clear", "poll", "enumProps"].includes(cmd))
{
  if (device.knownObjects.hasOwnProperty(objName)) {
    obj = device.knownObjects[propName];
  } else {
    const objType_ = parseInt(objType);
    const objInstance_ = parseInt(objInstance);

    if (isNaN(objType_) || isNaN(objInstance_)) {
      console.log("Invalid object type or instance");
      return;
    }

    obj = { type: objType_, instance: objInstance_ };
  }
}
// Initialize BACStack
const client = new bacnet({ apduTimeout: 6000 });

console.log( { obj })

switch (cmd) {
   case 'write': {
    if (!(propName in propertyIds)) {
      console.log("No such property", propName);
      console.log("Supported are:");
      console.log(Object.keys(propertyIds));
      return;
    }

    const propId = propertyIds[propName];
    client.writeProperty(device.ip, obj, propId, [{ type: valueType, value: value }], { priority: 8 }, (err) => {
      if (err) {
        console.log('Write property error:', err);
      } else {
        console.log('Property', propName, 'written successfully');
      }
    });

    break;
  }
    
  case 'whois': {
    client.on('iAm', (iAmDevice) => {
      console.log('address: ', iAmDevice.address);
      console.log('deviceId: ', iAmDevice.deviceId);
      console.log('maxAdpu: ', iAmDevice.maxAdpu);
      console.log('segmentation: ', iAmDevice.segmentation);
      console.log('vendorId: ', iAmDevice.vendorId);
      const objectListPropertyId = 76;
      const objectNamePropertyId = 77;
      // for(let i = 0; i < 255; i++)
      client.readProperty(
        device.ip,
        { type: 8, instance: iAmDevice.deviceId },
        objectListPropertyId,
        (err, value) => {
          value.values.forEach(object => {
            client.readProperty(
              device.ip,
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
    client.whoIs({ address: device.ip });
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
      if (!(propName in propertyIds)) {
        console.log("No such property", propName);
        console.log("Supported are:");
        console.log(Object.keys(propertyIds));
        return;
      }

      const propId = propertyIds[propName];
      
      setInterval(() => {
        client.readProperty(device.ip, obj, propId, (err, value) => {
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
