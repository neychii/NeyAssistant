const { fileLoader } = require("../../module/fileLoader.js");
const { skipFolders } = require("../../module/skipFolder.js");

async function events(client) {
    await client.events.clear;
    client.events = new Map();
    const events = [];

    const files = await fileLoader("src/Events");

    for (const file of files) {
        if (skipFolders(file)) {
            events.push({
                Events: file.split("/").pop().slice(0, -3),
                Status: "SubFolders"
            });
            continue;
        }
        try {
            const event = require(file);

            const execute = (...args) => event.execute(client, ...args);

            const target = event.rest ? client.rest : client;
            target[event.once ? "once" : "on"](event.type, execute);

            client.events.set(event.type, execute);

            events.push({
                Events: event.name,
                Status: "Loaded"
            });
        } catch (error) {
            const fileName = file.split("/").pop().slice(0, -3);
            events.push({
                Events: fileName,
                Status: "Failed"
            });
            console.error(
                `An error occured when loading "${fileName}": `,
                error
            );
        }
    }

    !events.length
        ? events.push({ Events: "Empty", Status: "No Events Detected" })
        : events;

    console.table(events, ["Events", "Status"]);
}

module.exports = { events };
