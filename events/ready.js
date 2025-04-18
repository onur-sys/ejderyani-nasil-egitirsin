const { Client } = require('discord.js');
const { magentaBright, cyanBright } = require('colorette');
const { guild_id } = require('../config.json');

module.exports = {
    name: 'ready',
    /**
     * @param {Client} client
     */
    async execute(client) {
        client.guilds.cache.forEach((guild) => {
            if (guild.id !== guild_id) {
                guild.leave();
              }
        });

        console.log(`${magentaBright('[Zoxy Says]:')} ${cyanBright(`Aktif`)}`);
    }
};
