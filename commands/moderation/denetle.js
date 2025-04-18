const util = require('../../utils/util.js');
const config = require('../../config.json');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("denetle")
    .setDescription("belirttiğiniz kanalı denetler")
    .addChannelOption((option) =>
      option
        .setName("kanal")
        .setDescription("Kanal seç.")
        .setRequired(true)
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const kanal = interaction.options.getChannel("kanal");

    const embed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setTitle(`Ejderhanı Nasıl Eğitirsin Roleplay Kanal Denetleme`)
      .setDescription(`✅ **Başarıyla ${kanal} adlı kanalı denetlediniz.**`)
      .setTimestamp()
      .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay' });

    await interaction.reply({ embeds: [embed] });

    const logEmbed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setDescription(`✅ :page_with_curl: ___***Denetle Log***___\n\n${interaction.user} adlı kişi ${kanal} adlı kanalı denetledi.`)
      .setTimestamp()
      .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay' });

    const logChannel = client.channels.cache.get('962040960739573810');
    if (logChannel) logChannel.send({ embeds: [logEmbed] });
  },
};
