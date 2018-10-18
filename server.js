const net = require('net');
const fs = require("fs");
const crypto = require('crypto');
const port = 8124;
let seed = 0;

const server = net.createServer((client) => {
    if (server.connections>2)
    {
        console.log("server at maximum capacity");
    }
    else
    {
        const fs = require('fs');
        client.id = Date.now() + seed++;
        fs.writeFile(client.id + ".txt", client.id + " connected.\r\n", (err)=>{});
        console.log('Client connected, ' + client.id);
        client.write('\r\nHello!\r\nRegards,\r\nServer\r\n');
        client.setEncoding('utf8');
        var userAuthorized = false;
        var FileUserAuthorized = false;
        var RemoteUserAuthorized = false;
        var answersArray = [];
        let filepath = "";
        let savedir = "";

        client.on('data', (data) => {
            if (userAuthorized) {
                console.log("User " + client.id + " asked: " + data);
                var answer = Math.round(Math.random() * 2);
                client.write(answersArray[answer]);
                fs.appendFile(client.id + ".txt", "User asked: " + data + "\r\n", (err) => {});
                console.log("Answer to user " + client.id + ": " + answersArray[answer]);
                fs.appendFile(client.id + ".txt", "Answer: " + answersArray[answer] + "\r\n", (err) => {});
            }
            else if (FileUserAuthorized) {
                console.log(data);
                let file = data.split('#');
                if(file[0]==="path")
                {
                    filepath=savedir + client.id + "/" + file[1];
                    console.log("User sent: " + filepath);
                    console.log(filepath + " : " + data);
                }
                else
                {
                    console.log("User sent: " + filepath + " data");
                    fs.writeFile(filepath, data.slice(5), "base64", function (err) {
                        if (err) throw err;
                        console.log(filepath + " data saved");
                    });
                }
            }
            else if (data === "FILES") {
                FileUserAuthorized = true;
                filepath = "";
                savedir = "server-files/";
                fs.mkdir(savedir + client.id, function (err) {
                    if (err) throw err;
                });
                client.write("ACK");
            }
            else if (RemoteUserAuthorized) {
                console.log(data);
                let client_command = data.split(' ');
                if(client_command[0]==="COPY")
                {
                    console.log('COPY');
                    fs.createReadStream(client_command[1]).pipe(fs.createWriteStream(client_command[2]));
                }
                else if(client_command[0]==="ENCODE")
                {
                    console.log('ENCODE');
                    const cipher = crypto.createCipher('aes192', client_command[3]);
                    fs.createReadStream(client_command[1]).pipe(cipher).pipe(fs.createWriteStream(client_command[2]));
                }
                else if(client_command[0]==="DECODE")
                {
                    console.log('DECODE');
                    const decipher = crypto.createDecipher('aes192', client_command[3]);
                    fs.createReadStream(client_command[1]).pipe(decipher).pipe(fs.createWriteStream(client_command[2]));
                }
                client.destroy();
            }
            else if(data === "REMOTE"){
                RemoteUserAuthorized = true;
                client.write("ACK");
            }
            else if (data === "QA") {
                userAuthorized = true;
                var qa = require('./qa.json');
                answersArray = [qa.Q1, qa.Q2, qa.Q3];
                client.write("ACK");
                console.log("User " + client.id + " sent: " + data);
                fs.appendFile(client.id + ".txt", "User sent: " + data + "\r\n", (err) => {});
                console.log("To user " + client.id + ":ACK");
                fs.appendFile(client.id + ".txt", "Answer: ACK" + "\r\n", (err) => {});
            }
            else {
                console.log("User " + client.id + " sent: " + data);
                fs.appendFile(client.id + ".txt", "User sent: " + data +"\r\n", (err) => {});
                console.log("To user " + client.id + ":DEC");
                fs.appendFile(client.id + ".txt", "Answer: DEC" + "\r\n", (err) => {});
                client.write("DEC");
                client.destroy();
                fs.appendFile(client.id + ".txt", "Client disconnected!" + "\r\n", (err) => {});
            }
        });

    client.on('end', () => {
        console.log('Client disconnected, ' + client.id); 
        fs.appendFile(client.id + ".txt", "Client disconnected!" + "\r\n", (err) => {});
        });
    }
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});