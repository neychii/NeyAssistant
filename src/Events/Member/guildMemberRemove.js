const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "Member Leave Listener",
    type: "guildMemberRemove",
    async execute(client, member) {
        const memberAvatar = member.user.displayAvatarURL({ dynamic: true });
        const guild = member.guild;
        const channel = await guild.channels.fetch(
            client.config.server.channels.welcome
        );

        const leaveEmbed = new EmbedBuilder()
            .setColor(client.color.primary)
            .setAuthor({
                name: guild.name,
                iconURL: guild.iconURL()
            })
            .setTitle(`Goodbye to ${member.user.username}!`)
            .setThumbnail(memberAvatar)
            .setDescription(
                `Farewell ${member}, be careful on your next journey and we'll definitely gonna miss you a lot.`
            )
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            });

        channel.send({
            content: `${member}`,
            embeds: [leaveEmbed]
        });
    }
};
