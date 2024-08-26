const config = require('../../config.js');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const mongodbURL = process.env.mongodb;
const { color, getTimestamp } = require('../../utils/loggingEffects.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        client.logs.info(`[SCHEMAS] Started loading schemas...`);

        if (!mongodbURL) return;

        mongoose.set("strictQuery", false);
        await mongoose.connect(mongodbURL || ``, {
        });

        if (mongoose.connect) {
            client.logs.success('[DATABASE] Connected to MongoDB successfully.');

            const schemaFolder = path.join(__dirname, '../../schemas'); 
            fs.readdir(schemaFolder, (err, files) => {
                if (err) {
                    client.logs.error('[ERROR] Error reading schemas folder:', err);
                    return;
                };
                client.logs.success(`[SCHEMAS] Loaded ${files.length} schema files.`);
            });
        };

        client.logs.info(`[EVENTS] Started loading events...`);
        client.logs.success(`[EVENTS] Loaded ${client.eventNames().length} events.`);
        

        console.log(`${color.blue}[${getTimestamp()}] =========================================================================================================`);
        console.log(`${color.blue}[${getTimestamp()}] ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗██████╗  ██████╗ ████████╗`);
        console.log(`${color.blue}[${getTimestamp()}] ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗╚══██╔══╝`);
        console.log(`${color.blue}[${getTimestamp()}]    ██║   ██║██║     █████╔╝ █████╗     ██║   ██████╔╝██║   ██║   ██║   `);
        console.log(`${color.blue}[${getTimestamp()}]    ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   ██╔══██╗██║   ██║   ██║   `);
        console.log(`${color.blue}[${getTimestamp()}]    ██║   ██║╚██████╗██║  ██╗███████╗   ██║   ██████╔╝╚██████╔╝   ██║   `);
        console.log(`${color.blue}[${getTimestamp()}]    ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═════╝  ╚═════╝    ╚═╝   `);
        console.log(`${color.blue}[${getTimestamp()}] =========================================================================================================`);
        console.log(`${color.blue}[${getTimestamp()}] =========================================================================================================`);
        console.log(`${color.blue}[${getTimestamp()}] ██████╗ ███████╗██╗   ██╗    ██████╗ ██╗   ██╗    ███╗   ███╗ █████╗ ██████╗  ██████╗ ██████╗         `);
        console.log(`${color.blue}[${getTimestamp()}] ██╔══██╗██╔════╝██║   ██║    ██╔══██╗╚██╗ ██╔╝    ████╗ ████║██╔══██╗██╔══██╗██╔════╝██╔═══██╗        `);
        console.log(`${color.blue}[${getTimestamp()}] ██║  ██║█████╗  ██║   ██║    ██████╔╝ ╚████╔╝     ██╔████╔██║███████║██████╔╝██║     ██║   ██║        `);
        console.log(`${color.blue}[${getTimestamp()}] ██║  ██║██╔══╝  ╚██╗ ██╔╝    ██╔══██╗  ╚██╔╝      ██║╚██╔╝██║██╔══██║██╔══██╗██║     ██║   ██║        `);
        console.log(`${color.blue}[${getTimestamp()}] ██████╔╝███████╗ ╚████╔╝     ██████╔╝   ██║       ██║ ╚═╝ ██║██║  ██║██║  ██║╚██████╗╚██████╔╝███████╗`);
        console.log(`${color.blue}[${getTimestamp()}] ╚═════╝ ╚══════╝  ╚═══╝      ╚═════╝    ╚═╝       ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝`);
        console.log(`${color.blue}[${getTimestamp()}] =========================================================================================================`);

        require('events').EventEmitter.defaultMaxListeners = config.eventListeners;
    },
};