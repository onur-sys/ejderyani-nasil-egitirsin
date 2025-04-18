const { Client, GuildMember, MessageEmbed, EmbedBuilder } = require('discord.js');
const discord = require("discord.js");

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {Client} client
     * @param {GuildMember} member
     */
    execute(client, member) {
        if (!member.user.bot) {
            if (client.db.get(`mutes.${member.id}`)) {
                member.roles.add(client.config('roles.mute'));
            }

            if (client.db.get(`rpy.${member.id}`)) {
                member.roles.add(client.config('roles.rpy'));
            }

            const embed = new discord.EmbedBuilder().setTitle(`Chamber of Secrets Roleplay`)
            .setDescription(`**Hoşgedin** ${member}!\n\nPotter serileri üzerinde genişleyen, etkileşimli içeriğe sahip, orijinal hikayelere ev sahipliği yapan, yepyeni discord rpg sunucusu olan **Chamber of Secrets Roleplay** ile Büyücülük Dünyasına daha önce hiç olmadığı gibi girmeye hazır olun.\n\nİster fanatik bir hayran olun, ister seriye yeni başlayan biri olun, **Chamber of Secrets Roleplay** içerisinde herkes için bir şeyler vardır. Büyücülük dünyasının en karanlık köşelerini keşfetmekten, sihirli hayvanlar hakkında daha fazlasını öğrenmeye kadar, bu büyülü platformda sizi bekleyen maceraların sınırı yok.\n\n\nBüyücülük Dünyasında daha önce hiç olmadığı gibi bir yolculukta bize katılmak için herhangi bir kılavuzu etiketleyip, ses kanalına girmen yeterli olacaktır.\n\nTekrardan aramıza hoşgeldin!
            
            `)
            .setImage('https://cdn-longterm.mee6.xyz/plugins/welcome/images/1006873463560089600/5a5624ac60a4edad3948e5c519710c4cd281eeacad53ec61dc3e752334215e32.gif')
            .setFooter({ text: 'Chamber of Secrets Roleplay Sihir Bakanı'});

            const channel = client.channels.cache.get(client.config('channels.hosgeldin'));

            return channel.send({ embeds: [embed] });
        }
    }
};
