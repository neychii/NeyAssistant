const path = `${process.cwd()}/function/handler/handlers`;
const { commands } = require(path);
const { loadingStart, loadingStop } = require(
    `${process.cwd()}/function/module/loadingDot.js`
);

module.exports = {
    name: "Ready",
    type: "ready",
    once: true,
    async execute(client) {
        await commands(client);

        loadingStart("Connecting to client");
        loadingStop(
            "Successfully connected to client!\nLogged in as " +
                client.user.username,
            5000
        );
    }
};
