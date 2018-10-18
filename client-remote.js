const net = require('net');
const port = 8124;

const client = new net.Socket();

const client_command = process.argv[2] + " " + process.argv[3] + " " + process.argv[4] + " " + process.argv[5] + " " + process.argv[6] + " " + process.argv[7];

client.setEncoding('utf8');

client.connect(port, function() {
    console.log('Connected');
    client.write("REMOTE");
});

client.on('data', function(data) {
    console.log(data);
    if (data === "ACK") {
        client.write(client_command);
    }
});

client.on('close', function() {
  console.log('Connection closed');
});