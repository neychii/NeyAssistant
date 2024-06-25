const trainAI = require(process.cwd() + "/function/training/train.js");
const session = require(process.cwd() + "/function/training/session.js");
const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("train-ai")
        .setDescription("Train the ai")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(client, interaction) {
        const trainStartEmbed = new EmbedBuilder()
            .setColor(client.color.primary)
            .setTitle("Training has begun!")
            .setDescription("Pleass wait, the ai is being trained…")
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            });

        const trainFinishedEmbed = new EmbedBuilder()
            .setColor(client.color.primary)
            .setTitle("Training has finished!")
            .setDescription("The training has been finished.")
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            });

        const msg = interaction.reply({
            embeds: [trainStartEmbed]
        });

        var model = await trainAI();
        model.save("file://" + __dirname + "storage/Model");
        session.addModel(model);

        msg.editReply({
            embeds: [trainFinishedEmbed]
        });
    }
};
