const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User.js');
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('maaş-yatır')
    .setDescription('Haftalık maaş yatırırsınız.'),

  async execute(client, interaction) {
    await interaction.reply({ content: 'Maaşlar veriliyor, bu işlem biraz sürecek... (1/3)' });

    const maaslar = config.maaşlar;
    const destekciRol = config.roles.destekçi;
    const maasLogKanalID = config.channels.maaş_log;

    let toplamUye = 0;
    let toplamRol = Object.keys(maaslar).length;

    await interaction.editReply({ content: 'Maaşlar veriliyor, bu işlem biraz sürecek... (2/3)' });

    await interaction.guild.members.fetch(); // Tüm üyeleri cache'e al

    const members = interaction.guild.members.cache;

    for (const member of members.values()) {
      const userData = await User.findOne({ userID: member.id });
      if (!userData) continue;

      let ekMaaş = 0;

      for (const [roleId, maas] of Object.entries(maaslar)) {
        if (member.roles.cache.has(roleId)) {
          ekMaaş += maas;
        }
      }

      if (member.roles.cache.has(destekciRol)) {
        ekMaaş += 500;
      }

      if (ekMaaş > 0) {
        userData.bank += ekMaaş;
        await userData.save();
        toplamUye++;
      }
    }

    await interaction.editReply({
      content: `Toplam **${toplamRol}** rolden, **${toplamUye}** üyeye başarıyla maaşları yatırıldı.`
    });

    const logChannel = client.channels.cache.get(maasLogKanalID);
    if (logChannel) {
      logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#9c0306')
            .setDescription(`💰 Toplam **${toplamRol}** rolden, **${toplamUye}** üyeye maaş yatırıldı.`)
            .setTimestamp()
            .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay' })
        ]
      });
    }
  }
};
