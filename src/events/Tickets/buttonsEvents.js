const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, UserSelectMenuBuilder, TextInputBuilder, TextInputStyle, embedLength } = require("discord.js");
const schema = require('../../schemas/ticketSchema');
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        if (interaction.customId === 'close') { // BUTTON CLOSE INTERACTION
            if (!interaction.member.roles.cache.find(r => r.id === client.config.buttonsStaff))  return await interaction.reply({ content: `❗ You don't have the permissions for use this command`, ephemeral: true })
            
            const embedClose = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})    
                .setTitle('Close Ticket')
                .setDescription('❗ For close the ticket you need the ID of the ticket Owner!\nIf you have the ID and you are sure to close the ticket press the button below')
                .setColor('Red')
                .setTimestamp()
                .setFooter({text: 'Dev By: marcoooooooooo_oo'})

            const button = new ButtonBuilder()
                .setCustomId('ticketclose') 
                .setLabel('Close')
                .setEmoji('❌')
                .setStyle(ButtonStyle.Danger)

            const buttons = new ActionRowBuilder().addComponents(button)

            await interaction.reply({embeds: [embedClose], components: [buttons], ephemeral: true})

        } else if (interaction.customId === 'ticketclose') { // MODAL CLOSE

            const modalClose = new ModalBuilder()
                .setTitle('Close the Ticket')
                .setCustomId('modalClose')

            const reason = new TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Reason for closure')
                .setPlaceholder('Enter the reason why the ticket is being closed')
                .setMaxLength(150)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const q = new ActionRowBuilder().addComponents(reason)
            modalClose.addComponents(q)

            await interaction.showModal(modalClose)


        } else if (interaction.customId === 'modalClose') { //MODAL CLOSE INTERACTION

            if (interaction.isModalSubmit()) {interaction.deferUpdate()}
            const ID = interaction.fields.getTextInputValue('id');
            const reason = interaction.fields.getTextInputValue('reason');
            const member = interaction.guild.members.cache.get(ID);
            const ticketOwner = await schema.findOne({userID: ID });
            const logsChannel = client.channels.cache.get(client.config.transcriptLogs);
            const channel = interaction.channel;
            const attachment = await discordTranscripts.createTranscript(channel, {
                limit: -1,
                returnType: 'attachment',
                filename: `${interaction.channel.name}.html`,
                saveImages: true,
                footerText: "{number} message exported",
                poweredBy: false,
                ssr: true
            });

            if (ticketOwner) {

                const embedLogs = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`}) 
                    .setTitle('New Transcript')
                    .addFields(
                        {name: `Ticket Name:`, value: `${interaction.channel.name}`, inline: true},
                        {name: `Opened By:`, value: `${member}`, inline: true},
                        {name: `Closed By:`, value: `${interaction.user}`, inline: true},
                        {name: `Closed For:`, value: `${reason}`, inline: false},
                    )
                    .setColor('Blue')
                    .setTimestamp()
                    .setFooter({text: 'Dev By: marcoooooooooo_oo'})

                const embedDM = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                    .setTitle('Ticket Closed')
                    .setDescription('Your ticket has been closed by a staffer')
                    .addFields(
                        {name: `Ticket Name:`, value: `${interaction.channel.name}`, inline: true},
                        {name: `Opened By:`, value: `${member}`, inline: true},
                        {name: `Closed By:`, value: `${interaction.user}`, inline: true},
                        {name: `Closed For:`, value: `${reason}`, inline: false},
                    )
                    .setColor('Blue')
                    .setTimestamp()
                    .setFooter({text: 'Dev By: marcoooooooooo_oo'})

                await logsChannel.send({embeds: [embedLogs], files: [attachment]})
                await member.send({embeds: [embedDM], files: [attachment]}).catch((err) => { return client.logs.error("[TICKETS] The user may have blocked DMs, message sending failed.") });
                await schema.findOneAndDelete({
                    tickets: `1`,
                    channelid: `${interaction.channel.id}`,
                })
                await interaction.channel.delete()


            } else {

                const embedID = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})    
                .setTitle('Wrong ID')
                .setDescription('The Ticket Owner ID could be wrong. Check again\nIf the error persists, contact `marcoooooooooo_oo` on Discord')
                .setColor('Red')
                .setTimestamp()
                .setFooter({text: 'Dev By: marcoooooooooo_oo'})

            await interaction.channel.send({content: `${interaction.user}`, embeds: [embedID], ephemeral: true}).then(msg => { setTimeout(() => {msg.delete().catch(err => {
                return;
            });}, 7000)}).catch(err => {
                return;
            });
            }

        } else if (interaction.customId === 'claim') { // INTERACTION BUTTON CLAIM
            if (!interaction.member.roles.cache.find(r => r.id === client.config.buttonsStaff))  return await interaction.reply({ content: `❗ You don't have the permissions for use this command`, ephemeral: true })

            const user = interaction.user;
            const guild = interaction.guild.id;
            const channel = interaction.channel;

            const embedClaimed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setTitle('Ticket Claimed')
                .setDescription('You have correctly claimed the ticket ')
                .setColor('Green')
                .setTimestamp()
                .setFooter({text: 'Dev By: marcoooooooooo_oo'})

            const embedChannel = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setTitle('Ticket Claimed')
                .setDescription(`The ticket has been claimed by ${interaction.user}`)
                .setColor('Green')
                .setTimestamp()
                .setFooter({text: 'Dev By: marcoooooooooo_oo'})

            const close = new ButtonBuilder()
                .setCustomId('close')
                .setLabel('Close Ticket')
                .setEmoji('🚫')
                .setStyle(ButtonStyle.Secondary);
    
            const claim = new ButtonBuilder()
                .setCustomId('claim')
                .setLabel('Claim')
                .setEmoji('🔑')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);
    
    
            const staff = new ButtonBuilder()
                .setLabel('Manage Ticket')
                .setCustomId('gestione')
                .setEmoji('🛠️')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(close, claim, staff);

            await interaction.reply({embeds: [embedClaimed], ephemeral: true});
            await interaction.channel.send({embeds: [embedChannel]});
            await interaction.message.edit({ components: [row], ephemeral: false });

        } else if (interaction.customId === 'staff') {  // INTERACTION BUTTON MANAGE TICKET

            const embedManage = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setTitle('Mange Ticket')
                .setDescription('Use the buttons below for manage the Ticket')
                .setColor('Blue')
                .setTimestamp()
                .setFooter({text: 'Dev By: marcoooooooooo_oo'})

            const buttonAddUser = new ButtonBuilder()
                .setLabel('Add User')
                .setCustomId('addUser')
                .setEmoji('➕')
                .setStyle(ButtonStyle.Primary);
            
            const buttonRemoveUser = new ButtonBuilder()
                .setLabel('Remove User')
                .setCustomId('removeUser')
                .setEmoji('➖')
                .setStyle(ButtonStyle.Danger);
                
            const buttonRename = new ButtonBuilder()
                .setLabel('Rename Ticket')
                .setCustomId('renameTicket')
                .setEmoji('📄')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(buttonAddUser, buttonRemoveUser, buttonRename);
            
            await interaction.reply({embeds: [embedManage], components: [row], ephemeral: true});

        } else if (interaction.customId === 'addUser') { // INTERACTION BUTTON ADDUSER
            if (!interaction.member.roles.cache.find(r => r.id === client.config.buttonsStaff))  return await interaction.reply({ content: `❗ You don't have the permissions for use this command`, ephemeral: true })

            const embedAddUser = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setTitle('Add User')
                .setDescription('Use the menu below for select the user to add at the Ticket')
                .setColor('Green')
                .setTimestamp()
                .setFooter({text: 'Dev By: marcoooooooooo_oo'})

            const addMemberMenu = new UserSelectMenuBuilder()
                .setCustomId('userAddMenu')
                .setPlaceholder("➕ Select the user to add at the Ticket")
                .setMinValues(1)
                .setMaxValues(1)

            const menu = new ActionRowBuilder().addComponents(addMemberMenu)

            await interaction.reply({embeds: [embedAddUser], components: [menu], ephemeral: true})

        } else if (interaction.customId === 'userAddMenu') { // INTERACTION MODAL ADDUSER

        const user = interaction.values[0];
        const channel = interaction.channel;

        const embedAdded = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTitle('User Added')
            .setDescription('The user has been added to the ticket')
            .setColor('Green')
            .setTimestamp()
            .setFooter({text: 'Dev By: marcoooooooooo_oo'})

        const embedChannelAdded = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTitle('User Added to the Ticket')
            .addFields(
                {name: `User Added:`, value: `<@${user}>`, inline: false},
                {name: `Added By:`, value: `${interaction.user}`, inline: false},
            )
            .setColor('Green')
            .setTimestamp()
            .setFooter({text: 'Dev By: marcoooooooooo_oo'})     

        channel.permissionOverwrites.edit(user, {
            SendMessages: true,
            ViewChannel: true,
            ReadMessageHistory: true
        }).catch(error => {return});

        await interaction.reply({embeds: [embedAdded], ephemeral: true})
        await channel.send({embeds: [embedChannelAdded]})

        } else if (interaction.customId === 'removeUser') { // INTERACTION BUTTON REMOVEUSER
            if (!interaction.member.roles.cache.find(r => r.id === client.config.buttonsStaff))  return await interaction.reply({ content: `❗ You don't have the permissions for use this command`, ephemeral: true })

            const embedRemoveUser = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setTitle('Remove User')
                .setDescription('Use the menu below for select the user to remove form the Ticket')
                .setColor('Red')
                .setTimestamp()
                .setFooter({text: 'Dev By: marcoooooooooo_oo'})

            const removeMemberMenu = new UserSelectMenuBuilder()
                .setCustomId('userRemoveMenu')
                .setPlaceholder("➖ Select the user to remove from the Ticket")
                .setMinValues(1)
                .setMaxValues(1)

            const menu = new ActionRowBuilder().addComponents(removeMemberMenu)

            await interaction.reply({embeds: [embedRemoveUser], components: [menu], ephemeral: true})

        } else if (interaction.customId === 'userRemoveMenu') { // INTERACTION MODAL REMOVEUSER

            const user = interaction.values[0];
        const channel = interaction.channel;

        const embedRemoved = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTitle('User Removed')
            .setDescription('The user has been removed from the ticket')
            .setColor('Red')
            .setTimestamp()
            .setFooter({text: 'Dev By: marcoooooooooo_oo'})

        const embedChannelRemoved = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTitle('User Removed from the Ticket')
            .addFields(
                {name: `User Removed:`, value: `<@${user}>`, inline: false},
                {name: `Removed By:`, value: `${interaction.user}`, inline: false},
            )
            .setColor('Red')
            .setTimestamp()
            .setFooter({text: 'Dev By: marcoooooooooo_oo'})     

        channel.permissionOverwrites.edit(user, {
            SendMessages: false,
            ViewChannel: false,
            ReadMessageHistory: false
        }).catch(error => {return});

        await interaction.reply({embeds: [embedRemoved], ephemeral: true})
        await channel.send({embeds: [embedChannelRemoved]})

        } else if (interaction.customId === 'renameTicket') { // INTERACTION BUTTON RENAME
            if (!interaction.member.roles.cache.find(r => r.id === client.config.buttonsStaff))  return await interaction.reply({ content: `❗ You don't have the permissions for use this command`, ephemeral: true })

            const renameTicket = new ModalBuilder()
                .setCustomId('renameModal')
                .setTitle('Rename the Ticket');
      
            const q1 = new TextInputBuilder()
                .setCustomId('name')
                .setLabel("New Name")
                .setPlaceholder('Enter the new ticket name. NO SPACE')
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setMaxLength(15)
    
            const q = new ActionRowBuilder().addComponents(q1);
            renameTicket.addComponents(q);

            await interaction.showModal(renameTicket);


        } else if (interaction.customId === 'renameModal') { // INTERACTION MODAL RENAME

            const name = interaction.fields.getTextInputValue('name');
            const channel = interaction.channel;

            const embedRenamed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setTitle('Ticket Renamed')
                .addFields(
                    {name: `New Name`, value: `${interaction.channel.name}`, inline: false},
                )
                .setColor('Green')
                .setTimestamp()
                .setFooter({text: 'Dev By: marcoooooooooo_oo'})  

            
            await channel.setName(`${name}`)

            const embedChannelRenamed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setTitle('Ticket Renamed')
                .addFields(
                    {name: `New Name:`, value: `${interaction.channel.name}`, inline: false},
                    {name: `Renamed By:`, value: `${interaction.user}`, inline: false},
                )
                .setColor('Blue')
                .setTimestamp()
                .setFooter({text: 'Dev By: marcoooooooooo_oo'})  
            
            await interaction.reply({embeds: [embedRenamed], ephemeral: true})
            await channel.send({embeds: [embedChannelRenamed]})
        }
    }
}
