const slash = require("./@type/slashCommand.js");

module.exports = {
    name: "Interactions",
    type: "interactionCreate",
    execute(client, interaction) {
        slash(client, interaction)
    }
};
