const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("toppuan-liste")
    .setDescription("puan listesine bakarsınız."),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const users = await User.find({ toprppuan: { $gt: 0 } }); // Haftalık puanı olanları çek

    const siraliListe = users
      .sort((a, b) => b.toprppuan - a.toprppuan)
      .map((x, index) => `**[${index + 1}]:** <@${x.userID}> **➔ ${x.toprppuan}**`)
      .slice(0, 10); // İlk 10 kişi
    
    const ToplamRP = users.reduce((acc, user) => acc + user.toprppuan, 0); // Toplam haftalık puan
    
    const embed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setAuthor({
        name: 'Ejderhanı Nasıl Eğitirsin RP Toplam Roleplay Listesi',
        iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
        url: 'https://discord.com'
      })
      .setDescription(`${siraliListe.length === 0 ? "Kimsenin toplam puanı yok." : siraliListe.join('\n')}`)
      .setFooter({ text: `Sunucudaki toplam rp kelime ➔ ${ToplamRP}` });
    
    await interaction.reply({ embeds: [embed] });
    },
};
