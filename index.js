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
  ventilSet: { type: 1, instance: 1207},
  ventilGet: { type: 0, instance: 1208},
  jalouise: { type: 5, instance: 3204002 }
}

const orig = [
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": 0,
    "type": 9
  },
  {
    "value": null,
    "type": 0
  }
];

const prep = [
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": 1,
    "type": 9
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": null,
    "type": 0
  },
  {
    "value": 0,
    "type": 9
  },
  {
    "value": null,
    "type": 0
  }
]

// Read Device Object
const requestArray = [{
  objectId: objects.jalouise,
  properties: [prop('priorityArray'), prop('objectName')]
}];
client.readPropertyMultiple('192.168.200.34', requestArray, (err, value) => {
  console.log('value: ', JSON.stringify(value, null, 2));
});
client.writeProperty('192.168.200.34', objects.jalouise, propertyIds.presentValue, [{type: 9, value: 1}], { priority: 16 }, (err) => {
  console.log('error: ', err);
});

// for(let i = 81; i < 123; i++)
//   client.readProperty('192.168.200.34', objects.ventilSet, i, (err, value) => {
//     if(value)
//       console.log(i, JSON.stringify(value.values, null, 2));
//   });

// read presentValue every second
// setInterval(() => {
//   client.readProperty('192.168.200.34', objects.ventilGet, propertyIds.presentValue, (err, value) => {
//     console.log('value: ', JSON.stringify(value, null, 2));
//   });
// }, 1000);
