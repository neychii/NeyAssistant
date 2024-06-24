const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    devs: true,
    data: new SlashCommandBuilder()
        .setName("emit")
        .setDescription("Artificially emits an events")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setName("events")
                .setDescription("Events to Trigger")
                .addChoices(
                    { name: "guildMemberAdd", value: "guildMemberAdd" },
                    { name: "guildMemberRemove", value: "guildMemberRemove" }
                )
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName("member")
                .setDescription("Trigger as someone else!")
        ),
    execute(client, interaction) {
        const { options } = interaction;
        const events = options.getString("events");
        const target = options.getUser("member") || interaction.member

        client.emit(events, target);

        const embed = new EmbedBuilder()
            .setColor("#9e6cf0")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setTitle(`Successfully emitted ${events}`)
            .setTimestamp();

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
