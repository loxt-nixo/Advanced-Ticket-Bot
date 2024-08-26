const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const { getTimestamp, color } = require('../../utils/loggingEffects');
        
        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
        try{
            await command.execute(interaction, client);
        } catch (error) {

            console.error(`${color.red}[${getTimestamp()}] [INTERACTION_CREATE] An error occurred while executing a command. \n${color.red}[${getTimestamp()}] [INTERACTION_CREATE] Check if you are using the right method: "async execute(interaction, client)":`, error);

            const embed = new EmbedBuilder()
            .setColor("Red")
            .setTimestamp()
            .setTitle('❗ Error!')
            .setDescription(`An error occurred executing this command.`);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } 
    },
};