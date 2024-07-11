const fs = require("fs");
const tf = require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
const natural = require("natural");
const session = require(process.cwd() + "/function/training/session.js");
const datasetPath = "storage/Dataset/dataset.json";

async function chatbot(client, message) {
    if (session.list[message.author.id]) return;
    var model = session.getModel();
    if (!model) {
        model = await tf.loadLayersModel("file://" + process.cwd() + "/storage/Model/model.json");
        session.addModel(model);
    }

    message.channel.sendTyping();

    const sentenceEncoder = await use.load();
    var Data = [{ message: message.content }];
    var Sentences = Data.map(t => t.message.toLowerCase());
    const xPredict = await sentenceEncoder.embed(Sentences);
    var prediction = await model.predict(xPredict).data();
    var highest = [0, 0];
    for (let i = 0; i < prediction.length; ++i) {
        if (highest[1] < prediction[i]) {
            highest[0] = i;
            highest[1] = prediction[i];
        }
    }
    var predicted = "";
    switch (highest[0]) {
        case 0:
            predicted = "Greeting";
            break;
        case 1:
            predicted = "Goodbye";
            break;
        case 2:
            predicted = "Insult";
            break;
        case 3:
            predicted = "Compliment";
            break;
    }

    var dataset = JSON.parse(fs.readFileSync(datasetPath));
    var input = [undefined, 0];

    dataset[predicted.toLowerCase()].patterns.forEach(msg => {
        var weight = natural.JaroWinklerDistance(message.content, msg);
        if (weight > input[1]) {
            input[0] = msg;
            input[1] = weight;
        }
    });

    var possibleResponses = [];
    if (input[1] > 0.5) {
        dataset[predicted.toLowerCase()].responses.forEach(res => {
            if (res.query == input[0]) {
                possibleResponses.push(res.response);
            }
        });
    }
    if (possibleResponses.length == 0) {
        dataset[predicted.toLowerCase()].responses.forEach(res => {
            if (res.query == "DEFAULT") {
                possibleResponses.push(res.response);
            }
        });
    }

    try {
    message.channel.send(
        possibleResponses[Math.floor(Math.random() * possibleResponses.length)]
    );
    } catch () {
        console.log("No available response for " + message.content)
    }

    if (client.config.AI.selflearning == true && highest[1] > 0.6) {
        if (dataset[predicted.toLowerCase()].patterns.includes(message)) return;
        dataset[predicted.toLowerCase()].patterns.push(message);
        fs.writeFileSync(datasetPath, JSON.stringify(dataset));
    }
}

module.exports = { chatbot }