const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");


module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {



if (interaction.isStringSelectMenu()) {
  const selectedValue = interaction.values[0];
    if (selectedValue === 'ticket1') {

  const modalTicket1 = new ModalBuilder()
    .setCustomId('ticket1modal')
    .setTitle(client.config.ticket1modalTitle || 'Ticket 1 Modal Title')

  const question1 = new TextInputBuilder()
    .setCustomId('q1')
    .setLabel(client.config.ticket1question1Label || 'Question 1 Label')
    .setPlaceholder(client.config.ticket1question1Placeholder || 'Question 1 Placeholder')
    .setStyle(TextInputStyle.Paragraph);

  const question2 = new TextInputBuilder()
    .setCustomId('q2')
    .setLabel(client.config.ticket1question2Label || 'Question 2 Label')
    .setPlaceholder(client.config.ticket1question2Placeholder || 'Question 2 Placeholder')
    .setStyle(TextInputStyle.Paragraph);

  const question3 = new TextInputBuilder()
    .setCustomId('q3')
    .setLabel(client.config.ticket1question3Label || 'Question 3 Label')
    .setPlaceholder(client.config.ticket1question3Placeholder || 'Question 3 Placeholder')
    .setStyle(TextInputStyle.Paragraph);

  const questions1 = new ActionRowBuilder().addComponents(question1);
  const questions2 = new ActionRowBuilder().addComponents(question2);
  const questions3 = new ActionRowBuilder().addComponents(question3);
  modalTicket1.addComponents(questions1, questions2, questions3);
        
  await interaction.showModal(modalTicket1);
            }
        }
    }
}