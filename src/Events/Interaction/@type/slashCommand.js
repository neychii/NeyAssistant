const {
    Collection,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    PermissionsBitField
} = require("discord.js");
const ms = require("pretty-ms");
const cooldown = new Collection();

async function slash(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = await client.commands.get(interaction.commandName);

    const cooldownID = `${interaction.user.id}:${command.data.name}`;
    const cooldownLeft = cooldown.has(cooldownID)
        ? cooldown.get(cooldownID) - Date.now()
        : null;

    const commandPermissions = {
        user: {
            list: command.perm?.user?.join(", ") ?? null,
            message:
                "You don't have the required permissions to use this command!"
        },
        bot: {
            list: command.perm?.bot?.join(", ") ?? null,
            message:
                "I don't have the required permissions to execute this command!"
        }
    };

    const outdateEmbed = new EmbedBuilder()
        .setColor(client.color.fail)
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        })
        .setTitle("⚠️ Commands Is Outdated!")
        .setDescription(
            `The commands you're trying to use is outdated and may not work anymore. Try re-open your discord after a few moments and if the issue still happen, please contact the devs immediately to get the issue fixed. Thank you`
        )
        .setTimestamp();

    const permissionEmbed = new EmbedBuilder()
        .setColor(client.color.warn)
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        })
        .setTitle("⛔ Missing Permissions!")
        .setTimestamp();

    const devsEmbed = new EmbedBuilder()
        .setColor(client.color.fail)
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        })
        .setTitle("🚫 Prohibited Commands!")
        .setDescription("This Commands is only available for developers.")
        .setTimestamp();

    const cooldownEmbed = new EmbedBuilder()
        .setColor(client.color.primary)
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        })
        .setTitle("🕒 This Commands is in Cooldown!")
        .setDescription(
            `You're currently in cooldown. Please wait for ${
                cooldownLeft ? ms(cooldownLeft, { compact: true }) : null
            } to use this commands again.`
        )
        .setFooter(
            cooldownLeft > 5000
                ? {
                      text: "Use button below to mention you when the cooldown ends?"
                  }
                : { text: "Please be patient~" }
        );

    const reportButton = new ButtonBuilder()
        .setCustomId("@report")
        .setLabel("Report this issue")
        .setEmoji("✉️")
        .setStyle("Danger");

    const mentionButton = new ButtonBuilder()
        .setCustomId("@mention")
        .setEmoji("🔔")
        .setStyle("Secondary");

    if (!command)
        return interaction
            .reply({
                embeds: [outdateEmbed],
                components: [
                    new ActionRowBuilder().addComponents(reportButton)
                ],
                ephemeral: true,
                fetchReply: true
            })
            .then(msg => {
                outdateEmbed
                    .setColor(client.color.success)
                    .setTitle("Report Sent!")
                    .setDescritpion(
                        "Thank you for reporting this issue, we will fix it as soon as possible."
                    );

                console.log("Commands Not Found!");

                msg.awaitMessageComponent({ time: 60000 }).then(i => {
                    i.editReply({ embeds: [outdateEmbed] });
                });
            });

    if (
        command.perm?.user &&
        !interaction.member.permissions.has(
            PermissionsBitField.resolve(command.perm.user || [])
        )
    ) {
        permissionEmbed
            .setDescription(commandPermissions.user.message)
            .addFields({
                name: "Required Permissions",
                value: commandPermissions.user.list ?? "None"
            });

        return interaction.reply({
            embeds: [permissionEmbed]
        });
    }

    if (
        command.perm?.bot &&
        !interaction.guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.perm.bot || [])
        )
    ) {
        permissionEmbed
            .setDescription(commandPermissions.bot.message)
            .addFields({
                name: "Required Permissions",
                value: commandPermissions.bot.list ?? "None"
            });

        return interaction.reply({
            embeds: [permissionEmbed]
        });
    }

    if (command.devs && !client.config.devs.includes(interaction.user.id))
        return interaction.reply({
            embeds: [devsEmbed],
            ephemeral: true
        });

    if (cooldown.has(cooldownID))
        return await interaction
            .reply({
                embeds: [cooldownEmbed],
                components:
                    cooldownLeft > 5000
                        ? [new ActionRowBuilder().addComponents(mentionButton)]
                        : [],
                ephemeral: true
            })
            .then(msg => {
                cooldownInteraction(msg);
            });

    try {
        command.execute(client, interaction);

        if (!command.cooldown) return;

        cooldown.set(cooldownID, Date.now() + command.cooldown);
        setTimeout(() => cooldown.delete(cooldownID), command.cooldown);
    } catch (error) {
        console.log(error);

        const errorEmbeds = new EmbedBuilder()
            .setColor(client.color.fail)
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setTitle("❌ An Error Occured")
            .setDescription(
                "An error occured while executing this command, please try again later. If the issue still happen, please contact the devs immediately to get the issue fixed. Thank you"
            )
            .setTimestamp();

        interaction
            .reply({
                embeds: [errorEmbeds],
                components: [
                    new ActionRowBuilder().addComponents(reportButton)
                ],
                ephemeral: true
            })
            .then(msg => {
                outdateEmbed
                    .setColor(client.color.success)
                    .setTitle("Report Sent!")
                    .setDescription(
                        "Thank you for reporting this issue, we will fix it as soon as possible."
                    );

                console.log("Error Found!");

                msg.awaitMessageComponent({ time: 60000 }).then(async i => {
                    await i.deferUpdate();
                    i.editReply({ embeds: [outdateEmbed], components: [] });
                });
            });
    }

    async function cooldownInteraction(msg) {
        const filter = i =>
            i.customId === "@mention" && i.user.id == interaction.user.id;

        let nestedInteraction;
        let mention = false;

        msg.awaitMessageComponent({ filter, time: command.cooldown }).then(
            async i => {
                await i.deferUpdate();
                nestedInteraction = i;
                mention = true;

                mentionButton.setDisabled(true);
                i.editReply({
                    components: [
                        new ActionRowBuilder().addComponents(mentionButton)
                    ]
                });
            }
        );

        setTimeout(() => {
            !msg ? null : msg.delete();
            if (mention == true)
                interaction.channel.send(
                    `${nestedInteraction.member} Your cooldown for </${interaction.commandName}:${interaction.commandId}> commands has ended!`
                );
        }, cooldownLeft);
    }
}

module.exports = slash;
