const fs = require("fs");
const tf = require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
const natural = require("natural");
const session = require(process.cwd() + "/function/training/session.js");
const datasetPath = "./storage/dataset/dataset.json";

async function chatbot(client, message) {
    if (session.list[message.author.id]) return;
    var model = session.getModel();
    if (!model) {
        model = await tf.loadLayersModel("file://" + __dirname + "storage/Model/model.json");
        Session.addModel(model);
    }

    message.channel.startTyping();

    const sentenceEncoder = await use.load();
    var Data = [{ message: message }];
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

    var dataset = JSON.parse(Fs.readFileSync(dataset));
    var input = [undefined, 0];

    dataset[predicted.toLowerCase()].patterns.forEach(msg => {
        var weight = natural.JaroWinklerDistance(message, msg);
        if (weight > input[1]) {
            input[0] = msg;
            input[1] = weight;
        }
    });

    var possibleResponses = [];
    if (input[1] > 0.5) {
        dataset[predicted.toLowerCase()].responses.forEach(res => {
            if (res.question == input[0]) {
                possibleResponses.push(res.message);
            }
        });
    }
    if (possibleResponses.length == 0) {
        dataset[predicted.toLowerCase()].responses.forEach(res => {
            if (res.question == "DEFAULT") {
                possibleResponses.push(res.message);
            }
        });
    }

    message.channel.send(
        possibleResponses[Math.floor(Math.random() * possibleResponses.length)]
    );

    if (client.config.AI.selflearning == true && highest[1] > 0.6) {
        if (dataset[predicted.toLowerCase()].patterns.includes(message)) return;
        dataset[predicted.toLowerCase()].patterns.push(message);
        Fs.writeFileSync(datasetPath, JSON.stringify(dataset));
    }
}

module.exports = { chatbot }