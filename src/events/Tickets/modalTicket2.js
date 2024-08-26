const { ActionRowBuilder, EmbedBuilder, ChannelType, PermissionsBitField, ButtonStyle, ButtonBuilder } = require("discord.js");
const schema = require('../../schemas/ticketSchema')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

    if (interaction.customId === "ticket2modal") {

        const q1 = interaction.fields.getTextInputValue('q1');
        const q2 = interaction.fields.getTextInputValue('q2');
        const q3 = interaction.fields.getTextInputValue('q3');
        const staffRole = client.config.ticket2ticketAccesRoleID;
        const category = client.config.ticket2ticketCategoryOpen;

        if (!staffRole || !category) return console.log('[TICKET 2] Category or role may be incorrect, please check')

        const data = await schema.findOne({username: interaction.user.tag});
        
        if (data) {
            const embedError = new EmbedBuilder()
                .setTitle('Ticket System')
                .setDescription("You already have another open ticket.\nYou don't have to have any other tickets open to open a new one")
                .setColor('Red')
                .setTimestamp()
                .setFooter({text: 'Dev By: marcoooooooooo_oo'})

            interaction.reply({embeds: [embedError], ephemeral: true})
            } else {

                const ticketChannel = await interaction.guild.channels.create({
                    name: `${client.config.ticket2ticketName}${interaction.user.tag}`,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: staffRole, 
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
        
                        ]
                    });


                    await schema.create({
                        username: interaction.user.tag,
                        userID: interaction.user.id,
                        tickets: `1`,
                        channelid: `${ticketChannel.id}`,
                    });

                    const embedOpen = new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setTitle('Ticket Open')
                        .setDescription(`Your ticket has been opened in the channel ${ticketChannel}`)
                        .setColor('Green')
                        .setTimestamp()
                        .setFooter({text: 'Dev By: marcoooooooooo_oo'})

                    const embedChannel = new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setTitle('New Ticket')
                        .setDescription(`${interaction.user} The server staff will respond to you as soon as it is available`)
                        .addFields(
                            {name: `${client.config.ticket2question1Label}`, value: `${q1}`, inline: false},
                            {name: `${client.config.ticket2question2Label}`, value: `${q2}`, inline: false},
                            {name: `${client.config.ticket2question3Label}`, value: `${q3}`, inline: false},            
                        )
                        .setTimestamp()
                        .setFooter({text: 'Dev By: marcoooooooooo_oo'})
                        .setColor('Blue')


                    const close = new ButtonBuilder()
                        .setLabel('Close Ticket')
                        .setCustomId('close')
                        .setEmoji('🚫')
                        .setStyle(ButtonStyle.Secondary);
                              
                    const claim = new ButtonBuilder()
                        .setLabel('Claim')
                        .setCustomId('claim')
                        .setEmoji('🔑')
                        .setStyle(ButtonStyle.Secondary);
                              
                    const staff = new ButtonBuilder()
                        .setLabel('Manage Ticket')
                        .setCustomId('staff')
                        .setEmoji('🛠️')
                        .setStyle(ButtonStyle.Secondary);

                    const buttons = new ActionRowBuilder().addComponents(close, claim, staff);

                    await interaction.reply({embeds: [embedOpen], ephemeral: true});
                    const msg = await ticketChannel.send({content: `<@&${staffRole}> ${interaction.user}`, embeds: [embedChannel], components: [buttons]});
                    await msg.pin();
            }
        }
    }
}