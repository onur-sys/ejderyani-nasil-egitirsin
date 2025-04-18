const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("zenginler")
    .setDescription("zenginler listesine bakarsınız."),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const users = await User.find({});

    const liste = users
      .filter(x => x.cash > 0)
      .sort((a, b) => b.cash - a.cash)
      .slice(0, 10)
      .map((x, index) => `**[${index + 1}]:** <@!${x.userID}> **➔ ${x.cash}** Sikke`);

    const toplamPara = users.reduce((acc, x) => acc + x.cash, 0);

    const embed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTitle(`**Ejderhanı Nasıl Eğitirsin Roleplay Zenginler Listesi**`)
      .setDescription(liste.length === 0 ? "Kimsenin parası yok." : liste.join('\n'))
      .setFooter({ text: `Şehir ekonomisi ➔ ${toplamPara} Sikke` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    const logEmbed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setDescription(`✅ :page_with_curl: ___***Zenginler Log***___\n\n${interaction.user} adlı kişi zenginler listesini kontrol etti.`)
      .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay' })
      .setTimestamp();

    const logChannel = client.channels.cache.get('917119698850705429');
    if (logChannel) await logChannel.send({ embeds: [logEmbed] });
    },
};
