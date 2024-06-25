const { chatbot } = require("./@type/chatbot.js");
const session = require(process.cwd() + "/function/training/session.js");

module.exports = {
    name: "Message Create Listener",
    type: "messageCreate",
    async execute(client, message) {
        await chatbot(client, message);
        
        if (message.channel.id == client.config.server.channels.chatbot) {
            session.recieve(message)
        }
    }
};
