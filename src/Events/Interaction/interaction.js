const slash = require("./@type/slashCommand.js");

module.exports = {
    name: "Interaction Listener",
    type: "interactionCreate",
    execute(client, interaction) {
        slash(client, interaction)
    }
};
