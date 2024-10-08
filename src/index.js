const { Client, GatewayIntentBits, Collection, EmbedBuilder, Partials, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require(`discord.js`);
const fs = require('fs');
const { getTimestamp, color } = require('./utils/loggingEffects');

let client;
try {
    client = new Client({ 
        intents: [
            GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMessages, 
            GatewayIntentBits.MessageContent, 
            GatewayIntentBits.GuildMembers, 
            GatewayIntentBits.GuildPresences, 
            GatewayIntentBits.GuildIntegrations, 
            GatewayIntentBits.GuildWebhooks, 
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.MessageContent, 
            GatewayIntentBits.GuildEmojisAndStickers, 
            GatewayIntentBits.DirectMessages, 
            GatewayIntentBits.DirectMessageTyping, 
            GatewayIntentBits.GuildModeration, 
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildWebhooks, 
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.GuildScheduledEvents, 
            GatewayIntentBits.GuildMessageTyping, 
            GatewayIntentBits.AutoModerationExecution, 
        ],  

        partials: [
            Partials.GuildMember, 
            Partials.Channel,
            Partials.GuildScheduledEvent,
            Partials.Message,
            Partials.Reaction, 
            Partials.ThreadMember, 
            Partials.User
        ],
    }); 
} catch (error) {
    console.error(`${color.red}[${getTimestamp()}]${color.reset} [ERROR] Error while creating the client. \n${color.red}[${getTimestamp()}]${color.reset} [ERROR]`, error);
};

client.logs = require('./utils/logs');
client.config = require('./config');

require('./functions/processHandlers')();

client.commands = new Collection();
client.aliases = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events")
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token).then(() => {
    }).catch((error) => {
        console.error(`${color.red}[${getTimestamp()}]${color.reset} [LOGIN] Error while logging in. Check if your token is correct or double check your also using the correct intents. \n${color.red}[${getTimestamp()}]${color.reset} [LOGIN]`, error);
    });
})();