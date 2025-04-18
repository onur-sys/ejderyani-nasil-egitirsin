const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'presenceUpdate',
    async execute(client, oldPresence, newPresence) {
        const member = newPresence.member;
        if (!member) return;

        const destekciRol = config.roles.destekçi;
        const tag = "ℵ";
        const durumYazisi = "discord.gg/denemerp";

        const logChannel = client.channels.cache.get(config.logs.taglog);

        await member.user.fetch();

        const usernameIncludesTag = member.user.username?.includes(tag);
        const bioIncludesTag = member.user.bio?.includes(tag);
        const stateIncludesTag = newPresence.activities.find(x => x.state)?.state?.includes(durumYazisi);

        if (usernameIncludesTag || bioIncludesTag || stateIncludesTag) {
            if (!member.roles.cache.has(destekciRol)) {
                await member.roles.add(destekciRol).catch(() => {});
                if (logChannel) logChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`> ${member} adlı kişiye tag taşıdığı için destekçi rolü verildi!`)
                            .setTimestamp()
                    ]
                });
            }
        } else {
            if (member.roles.cache.has(destekciRol)) {
                await member.roles.remove(destekciRol).catch(() => {});
                if (logChannel) logChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`> ${member} adlı kişiden tag bıraktığı için destekçi rolü alındı!`)
                            .setTimestamp()
                    ]
                });
            }
        }
    }
}
