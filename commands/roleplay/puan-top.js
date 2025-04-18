const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("rppuan-liste")
    .setDescription("haftalık güncel roleplay listesine bakarsınız."),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const users = await User.find({ rppuan: { $gt: 0 } }); // Haftalık puanı olanları çek

    const siraliListe = users
      .sort((a, b) => b.rppuan - a.rppuan)
      .map((x, index) => `**[${index + 1}]:** <@${x.userID}> **➔ ${x.rppuan}**`)
      .slice(0, 10); // İlk 10 kişi
    
    const haftalikToplamRP = users.reduce((acc, user) => acc + user.rppuan, 0); // Toplam haftalık puan
    
    const embed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setAuthor({
        name: 'Ejderhanı Nasıl Eğitirsin RP Haftalık Roleplay Listesi',
        iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
        url: 'https://discord.com'
      })
      .setDescription(`${siraliListe.length === 0 ? "Kimsenin puanı yok." : siraliListe.join('\n')}`)
      .setFooter({ text: `Bu haftaki toplam rp kelime ➔ ${haftalikToplamRP}` });
    
    await interaction.reply({ embeds: [embed] });
    },
};
