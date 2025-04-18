const { Client, GuildMember, MessageEmbed } = require('discord.js');
const discord = require("discord.js");

module.exports = {
    name: 'guildMemberRemove',
    /**
     * @param {Client} client
     * @param {GuildMember} member
     */
    execute(client, member) {
        if (!member.user.bot) {
            const embed = new discord.EmbedBuilder()
                .setTitle(`Chamder Discordundan Ayrıldı Zoxy ile ben arkasından ağladık!`)
                .setDescription(
                    `**\`${member.user.tag}\` İngiltere ülkesinin sınırlarından çıkış yaptı!**`
                );

            const channel = client.channels.cache.get(client.config('channels.baybay'));

            channel.send({ embeds: [embed] });
        }
    }
};
