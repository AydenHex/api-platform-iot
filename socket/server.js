const io = require('socket.io')();
var SerialPort = require('serialport');
var util = require("util");
var request = require("request").defaults({rejectUnauthorized:false});
var xbee_api = require('xbee-api');
var C = xbee_api.constants;

var openingStatus = new Map();
var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

let serialport = new SerialPort("COM3", {
  baudRate: 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

/**
 * Allow to retrieve nodes (openings) from the db
 * Called when the script starts
 */
function retrieveNodes() {
  var req = {
    uri: 'https://localhost:8443/openings',
    method: 'GET'
  }
  request(req, callback)
  function callback(error, response, body) {
    if (error) {
      console.log(`Can't retrieve nodes from the db : ${error}`)
    } else {
      body = JSON.parse(body);
      body["hydra:member"].forEach((function(opening){
        openingStatus.set(opening.adress64, [opening.id, opening.opened])
      }));
      console.log(`Succesffuly load ${openingStatus.size} node(s).`)
    }
  }

}

/**
 * Allows to change the state of an opening on the db
 * @param address
 */
function changeState(address) {
  opening = openingStatus.get(address)

  var req = {
    uri: 'https://localhost:8443/openings/' + opening[0],
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/merge-patch+json'
    },
    body: {
      opened: !opening[1],
    },
    json: true
  };

  request(req,callback);
  function callback(error, response, body) {
    if (error) {
      console.log(`Can't change state of the opening : ${error}`)
      return
    } else {
      openingStatus.set(address, [body.id, body.opened])
      console.log(`Status changed successfuly for the opening ${address}`)
    }
  }
}

/**
 * Allow to register an opening on the db
 * @param address
 * @param basic -> True if the node has been registed thanks to Join Notification
 */
function registrationSettings(address, basic) {
  console.log(`REGISTRATION - A new node have been identified`)

  var frameJoinNotif = {
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: address,
    command: "JN",
    commandParameter: [1],
  }

  xbeeAPI.builder.write(frameJoinNotif);

  console.log("Registration commands sent successfully");

  // Send the new opening to api
  var req = {
    uri: 'https://localhost:8443/openings',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      name: "ouverture_1_test",
      adress64: address,
      opened: basic ? false : true,
    },
    json: true
  };
  request(req, callback)
  function callback(error, response, body) {
    if (error) {
      console.error(error)
      return
    }
    //Registration of the new node
    openingStatus.set(address, [body.id, basic ? false : true])

    if(response.code === 409) {
      console.log("Can't register an opening twice")
      return
    }
    console.log('This node has been registered: ' + address)
  }

}

retrieveNodes();

serialport.on("open", function () {
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "NI",
    commandParameter: [],
  };

  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
  xbeeAPI.builder.write(frame_obj);

});

// All frames parsed by the XBee will be emitted here

xbeeAPI.parser.on("data", function (frame) {

  //on new device is joined, register it

  //on packet received, dispatch event
  //let dataReceived = String.fromCharCode.apply(null, frame.data);
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);

    browserClient && browserClient.emit('pad-event', {
      device: frame.remote64,
      data: dataReceived
    });
  }

  if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
    registrationSettings(frame.sender64, true);

  } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {

    console.log(`EVENT - The opening status ${frame.remote64} has changed`)

    // Test if this opening is registered. If not, register it in open state
    if (openingStatus.has(frame.remote64)) {
      changeState(frame.remote64)
    } else {
       registrationSettings(frame.remote64, false);
    }


  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {

  } else {
    console.debug(frame);
    let dataReceived = String.fromCharCode.apply(null, frame.commandData)
    console.log(dataReceived);
  }

});
let browserClient;
io.on('connection', (client) => {
  console.log(client.client.id);
  browserClient = client;

client.on('subscribeToPad', (interval) => {
  console.log('client is subscribing to timer with interval ', interval);
  // setInterval(() => {
  //   client.emit('pad-event', {
  //     device: "test device",
  //     data: Math.round(Math.random()) * 2 - 1
  //   })
  //   ;
  // }, Math.random() * 1000);
});

  client.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
//
// serial_xbee.on("data", function(data) {
//     console.log(data.type);
//   // console.log('xbee data received:', data.type);
//   // client.emit('timer', "pouet");
// //
// });

// shepherd.on('ready', function () {
//   console.log('Server is ready.');
//
//   // allow devices to join the network within 60 secs
//   shepherd.permitJoin(60, function (err) {
//     if (err)
//       console.log(err);
//   });
// });
//
// shepherd.start(function (err) {                // start the server
//   if (err)
//     console.log(err);
// });
