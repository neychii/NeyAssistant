const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
var sessions = {};
var model;

module.exports = {
    list: sessions,
    addPattern: function (id, category) {
        sessions[id] = {
            mode: "patterns",
            category: category,
            messages: []
        };
    },
    addResponse: function (id, category, dataset, query) {
        sessions = {
            mode: "responses",
            category: category,
            messages: [],
            dataset: dataset,
            query: query
        };
    },
    remove: function (id) {
        delete sessions[id];
    },
    recieve: function (client, message) {
        const payload = message.content;
        const user = message.author;

        if (!sessions[user.id]) return;
        if (payload.toLowerCase().startsWith("endsess")) {
            this.save(user.id);
            this.remove(user.id);

            const endsessEmbed = new EmbedBuilder()
                .setColor(client.color.primary)
                .setTitle("Session Ended!")
                .setDescription(
                    "Thanks for helping me learn, your entry is saved and ready to trained."
                );

            message.reply({
                embeds: [endsessEmbed]
            });
        }

        if (sessions[user.id].mode == "patterns") {
            sessions[user.id].messages.push(payload.toLowerCase());
        } else {
            sessions[user.id].messages.push({
                response: payload,
                query: sessions[user.id].query
            });
        }

        message.react("👍");

        if (sessions[user.id].mode == "responses") {
            const dataset = sessions[user.id].dataset;
            const randQuery =
                dataset.patterns[
                    Math.floor(Math.random() * dataset.patterns.length)
                ];

            const trainEmbed = new EmbedBuilder()
                .setColor(client.color.primary)
                .setTitle("Respond to the text below")
                .setDescription(`"${randQuery}"`);

            message.channel.send({ embed: [trainEmbed] });
            sessions[user.id].query = randQuery;
        }
    },
    save: function (id) {
        var session = Sessions[id];
        const datasetPath = "./storage/Dataset/dataset.json"
        if (!session.messages.length) return;

        var dataset = JSON.parse(Fs.readFileSync(datasetPath));
        
        session.messages.forEach(msg => {
            if (Dataset[session.category][session.mode].find(c => c == msg)) return;
            Stats[session.category]++;
            Dataset[session.category][session.mode].push(msg);
        });

        Fs.writeFileSync(datasetPath, JSON.stringify(Dataset), "\t", null);
    },
    getModel() {
        return model;
    },
    addModel(TModel) {
        model = TModel;
    }
};
