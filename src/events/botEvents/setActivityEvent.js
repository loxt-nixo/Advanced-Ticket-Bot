const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {

        setInterval(() => {

            let activities = [
                { type: 'Watching', name: `Dev: Marco_`},
                { type: 'Watching', name: `Best Ticket Bot`},
            ];

            const status = activities[Math.floor(Math.random() * activities.length)];

            if (status.type === 'Watching') {
                client.user.setPresence({ activities: [{ name: `${status.name}`, type: ActivityType.Watching }]});
            } else {
                client.user.setPresence({ activities: [{ name: `${status.name}`, type: ActivityType.Playing }]});
            } 
        }, 7500);
        client.logs.success(`[STATUS] Rotating status loaded successfully.`);
    }
}