const { Client, Guild } = require('discord.js');
const { guild_id } = require('../config.json');

module.exports = {
    name: 'guildCreate',
    /**
     * @param {Client} client
     * @param {Guild} guild
     */
    execute(client, guild) {
        if (guild.id !== guild_id) {
            guild.leave();
          }
}};
