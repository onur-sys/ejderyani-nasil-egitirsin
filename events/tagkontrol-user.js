const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(client, oldMember, newMember) {
        const destekciRol = config.roles.destekçi;
        const tag = "ℵ";

        const nameIncludesTag = newMember.displayName.includes(tag);
        const aboutMeIncludesTag = newMember.user?.bio?.includes(tag);

        const logChannel = client.channels.cache.get(config.logs.taglog);

        if (nameIncludesTag || aboutMeIncludesTag) {
            if (!newMember.roles.cache.has(destekciRol)) {
                await newMember.roles.add(destekciRol).catch(() => {});

                if (logChannel) logChannel.send({ embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`> ${newMember} adlı kişiye tag taşıdığı için destekçi rolü verildi!`)
                        .setTimestamp()
                ]});
            }
        } else {
            if (newMember.roles.cache.has(destekciRol)) {
                await newMember.roles.remove(destekciRol).catch(() => {});

                if (logChannel) logChannel.send({ embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`> ${newMember} adlı kişiden tag bıraktığı için destekçi rolü alındı!`)
                        .setTimestamp()
                ]});
            }
        }
    }
}