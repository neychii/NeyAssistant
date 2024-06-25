const filePath = `${process.cwd()}/storage/Images/welcomebg.png`;
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "Member Join Listener",
    type: "guildMemberAdd",
    async execute(client, member) {
        const memberAvatar = member.user.displayAvatarURL({ dynamic: true });
        const guild = member.guild;
        const channel = await guild.channels.fetch(
            client.config.server.channels.welcome
        );

        const file = new AttachmentBuilder()
            .setFile(filePath)
            .setName("welcome.png");

        const welcomeEmbed = new EmbedBuilder()
            .setColor(client.color.primary)
            .setAuthor({
                name: member.user.username,
                iconURL: memberAvatar
            })
            .setTitle(`Welcome to ${guild.name}!`)
            .setThumbnail(memberAvatar)
            .setDescription(
                `Hello ${member}, welcome to our server and we hope you enjoy your stay here~`
            )
            .setImage("attachment://welcome.png")
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            });

        channel.send({
            content: `${member}`,
            embeds: [welcomeEmbed],
            files: [file]
        });
    }
};
