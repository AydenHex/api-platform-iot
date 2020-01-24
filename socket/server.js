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

function retrieveNodes() {
  request('https://localhost:8443/openings', function (error, response, body) {
    if (error) {
      console.log("Can't retrieve openings")
    } else {
      body = JSON.parse(body);
      body["hydra:member"].forEach((function(opening){
        openingStatus.set(opening.adress64, opening.opened)
      }));
    }
    console.log(`Succesffuly load ${openingStatus.size} node(s).`)
  });
}

function registrationSettings(address) {
  console.log(`REGISTRATION - A new node have been identified`)

  var frameJoinNotif = {
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: address,
    command: "JN",
    commandParameter: [1],
  }

  xbeeAPI.builder.write(frameJoinNotif);

  console.log("Registration commands sent successfully");

  // Registration of the new node
  openingStatus.set(address, !openingStatus.get(address))

  console.log(address);
  // Send the new opening to api
  request.post('https://localhost:8443/openings', {
    json: {
      name: "ouverture_1_test",
      adress64: address,
      opened: false,
    }
  }, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }

    console.log('This node has been registered')
  })

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
    registrationSettings(frame.sender64);

  } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {

    console.log(`EVENT - The opening status ${frame.sender16} has changed`)

    // Test if this opening is registered. If not, register it in open state
    if (openingStatus.has(frame.remote64)) {
      openingStatus.set(frame.remote64, !openingStatus.get(frame.remote64))
    } else {
      registrationSettings(frame.remote64);
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
