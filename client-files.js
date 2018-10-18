const net = require('net');
var readdirp = require('readdirp');
var fs = require("fs");
const port = 8124;

const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, function() {
    console.log('Connected');
    client.write("FILES");
});

client.on('data', function(data) {
    console.log(data);
    if (data === "ACK") {
        process.argv.slice(2).forEach(function (Path) {
            const settings = {
                root: Path,
                Filter: '!.git'
            };
            readdirp(settings, function(file) {
                    fs.readFile(file.fullPath, "base64", function (err, data) {
                        if (err) throw err;
                        pathsplit(client, file.path, () => {
                            datasplit(client, file.path, data);
                        });
                    });
                }, function (err, res) {
                    if (err) throw err;
                }
            );
        });
    }
});

function pathsplit(fclient, fpath, callback) {
    fclient.write("path#" + fpath);
    console.log(fpath + " was sent");
    console.log("path#" + fpath);
    callback();
}

function datasplit(fclient, fpath, fdata) {
    fclient.write("data#" + fdata.toString());
    console.log(fpath + " data was sent");
    console.log("data#" + fdata);
}

client.on('close', function() {
  console.log('Connection closed');
});