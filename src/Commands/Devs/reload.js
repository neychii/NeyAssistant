const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");
const { events, commands } = require(
    process.cwd() + "/function/handler/handlers.js"
);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reload the bots")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("The type of reload")
                .addChoices(
                    { name: "Commands", value: "Commands" },
                    { name: "Events", value: "Events" }
                )
        ),
    devs: true,
    perm: { user: ["Administrator"] },
    async execute(client, interaction) {
        const { options } = interaction;
        const type = options.getString("type");

        const reloadEmbed = new EmbedBuilder()
            .setColor(client.color.primary)
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setTitle(`🔄 Reloading ${type}`)
            .setDescription("Please wait for a few seconds...")
            .setTimestamp();

        switch (type) {
            case "Commands":
                {
                    setTimeout(() => commands(client), 500);
                }
                break;
            case "Events":
                {
                    for (const [key, value] of client.events) {
                        await client.removeListener(`${key}`, value, true);
                    }
                    events(client);
                }
                break;
            default: {
                reloadEmbed
                    .setTitle(`🔄 Reloading the Bots`)
                    .setDescription("Please wait for a few seconds...");

                for (const [key, value] of client.events) {
                    await client.removeListener(`${key}`, value, true);
                }

                setTimeout(() => commands(client), 500);
                events(client);
            }
        }

        interaction.reply({ embeds: [reloadEmbed], ephemeral: true });
    }
};
