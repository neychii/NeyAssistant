const { GatewayIntentBits, Partials } = require("discord.js");

function intentListing(list) {
    var intents = [];
    var partials = [];

    try {
        list.partial.forEach(intent => {
            partials.push(Partials[intent]);
        });

        list.intent.forEach(intent => {
            intents.push(GatewayIntentBits[intent]);
        });
    } catch (e) {
        console.error("An Error Occured When Listing Intents: " + e);
        throw e;
    }

    return {
        list: intents,
        partial: partials
    };
}

module.exports = { intentListing };
