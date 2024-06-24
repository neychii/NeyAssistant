require("dotenv").config();

console.clear();

process.on("unhandledRejection", err => {
    console.error(err);
    throw err;
});

const { Client, Collection } = require("discord.js");
const { intentListing } = require("./function/module/intentListing.js");
const config = require("./storage/config.json");
config.token = process.env.token;

const intent = intentListing(config.system.intents);
const client = new Client({
    intents: intent.list,
    partials: intent.partial
});

const { events } = require("./function/handler/handlers.js");

client.commands = new Collection();
client.events = new Collection();
client.config = config.client;
client.color = config.client.colors;

events(client);

client.login(config.token);
