const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, PermissionsBitField, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-send')
        .setDescription('Send the embed')
        .setDMPermission(false)
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Where to send the embed to open tickets')
                .setRequired(true)
        ),

        async execute(interaction, client) {
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) return await interaction.reply({ content: '❗ You do not have the necessary permissions to run this command. Permissions required: Administrator', ephemeral: true });

            const channel = interaction.options.getChannel('channel');

            const embedTickets = new EmbedBuilder()
                .setTitle('Open a Ticket')
                .setDescription('Click the menu for open a ticket')
                .setTimestamp()
                .setFooter({text: 'Dev by marcoooooooooo_oo'})
                .setColor('Blue')

            const menu =  new StringSelectMenuBuilder()
                .setCustomId('menu')
                .setPlaceholder(client.config.menuPlaceholder)
			    .addOptions(
				    new StringSelectMenuOptionBuilder()
					    .setLabel(client.config.ticket1Label || 'Ticket 1 Label')
					    .setDescription(client.config.ticket1Description || 'Ticket 1 Description')
                        .setEmoji(client.config.ticket1Emoji || '1️⃣')
					    .setValue('ticket1'),

				    new StringSelectMenuOptionBuilder()
					    .setLabel(client.config.ticket2Label || 'Ticket 2 Label')
					    .setDescription(client.config.ticket2Description || 'Ticket 2 Description')
                        .setEmoji(client.config.ticket2Emoji || '2️⃣')
					    .setValue('ticket2'),

                    new StringSelectMenuOptionBuilder()
					    .setLabel(client.config.ticket3Label || 'Ticket 3 Label')
					    .setDescription(client.config.ticket3Description || 'Ticket 3 Description')
                        .setEmoji(client.config.ticket3Emoji || '3️⃣')
					    .setValue('ticket3')
			);

            const row = new ActionRowBuilder().addComponents(menu)
            await interaction.reply({content: `Tickets sent successfully in the channel ${channel}`, ephemeral: true})
            await channel.send({embeds: [embedTickets], components: [row]})
            
        }
}