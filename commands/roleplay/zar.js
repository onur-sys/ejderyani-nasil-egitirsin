const util = require('../../utils/util.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("zar")
    .setDescription("zar atarsınız."),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {

    const zarEmbed = new discord.EmbedBuilder()
    .setColor("#9c0306")
    .setTitle(`**Zar**`)
    .setDescription(`**${Math.floor(Math.random() * 19) + 1}** geldi.`)
    .setTimestamp();

  await interaction.reply({
    embeds: [zarEmbed],
  });
  },
};