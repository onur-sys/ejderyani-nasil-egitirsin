const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("para-yatır")
    .setDescription("Bankanıza para yatırırsınız.")
    .addIntegerOption((option) =>
      option
        .setName("miktar")
        .setDescription("yatırılacak miktar gir.")
        .setRequired(true)
    ),
  /**
   * @miktarm {discord.Client} client
   * @miktarm {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    let miktar = interaction.options.getInteger("miktar");

    if (!miktar || isNaN(miktar)) {
      return interaction.reply('Lütfen geçerli bir miktar belirtiniz.');
    }
    
    if (Number(miktar) < 0) {
      return interaction.reply('Belirtilen miktar **0**dan küçük olamaz.');
    }
    
    const userID = interaction.user.id;
    
    const data = await User.findOne({ userID: userID });
    
    if (!data || data.cash < Number(miktar)) {
      return interaction.reply('Yeterli miktarda sikke bulunmamaktadır.');
    }
    
    // Para transferi
    await User.findOneAndUpdate(
      { userID: userID },
      {
        $inc: {
          cash: -Number(miktar),  // cüzdandan düş
          bank: Number(miktar)    // bankaya ekle
        }
      },
      { upsert: true }
    );
    
    interaction.reply(`Bankanıza **${util.formatNumber(Number(miktar))} Sikke** yatırıldı.`);
    
  },
};