const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const config = require('../../config.json');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("rolmodel")
    .setDescription("rol model görünümünüze bakarsınız.")
    .addUserOption((option) =>
      option.setName("kullanıcı")
    .setDescription("rol model bakacağın kullanıcı seç.")
    .setRequired(false)
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const targetUser = interaction.options.getUser('kullanıcı') || interaction.user;
    const userID = targetUser.id;

    const userData = await User.findOne({ userID: userID });

    if (!userData || !userData.rpmodel) {
      return interaction.reply({
        content: `Bu kişinin rol model görünümü bulunamadı.`,
        ephemeral: true
      });
    }

    const embed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setAuthor({
        name: `${targetUser.username} kişisinin Rol Model Görünümü`,
        iconURL: targetUser.displayAvatarURL({ dynamic: true })
      })
      .setImage(userData.rpmodel)
      .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay' })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
