const net = require('net');
const port = 8124;

const client = new net.Socket();
var answersArray = [];
var questionArray = [];
var questionCounter = 0;

client.setEncoding('utf8');

client.connect(port, function() {
    console.log('Connected');
    client.write("QA");
});

client.on('data', function(data) {
  console.log(data);
  if (data === "ACK") {
        var qa = require('./qa.json');
        answersArray = [qa.Q1, qa.Q2, qa.Q3];
        questionArray = ["Q1", "Q2", "Q3"];
        console.log("Question: " + questionArray[questionCounter]);
        client.write(questionArray[questionCounter]);
        questionCounter++;
    }
    if (data !== "ACK" && data !== "DEC" && data.startsWith("A") && questionCounter <= questionArray.length) {
        if (data === answersArray[questionCounter - 1]) {
            console.log("Correct");
        }
        else {
            console.log("Wrong")
        }
        if (questionCounter != questionArray.length)
        {
            console.log("\r\nQuestion: " + questionArray[questionCounter]);
            client.write(questionArray[questionCounter]);
            questionCounter++;
        }
        else{
            client.destroy();
        }
    }
});

client.on('close', function() {
  console.log('Connection closed');
});