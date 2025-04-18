const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("para-çek")
    .setDescription("Bankadan para çekersiniz")
    .addIntegerOption((option) =>
      option
        .setName("miktar")
        .setDescription("çekilecek miktar gir.")
        .setRequired(true)
    ),
  /**
   * @miktarm {discord.Client} client
   * @miktarm {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    let miktar = interaction.options.getInteger("miktar");
    let bankapara = client.db.get(`${interaction.user.id}.servet.banka`);

    if (!miktar || isNaN(miktar)) {
      return interaction.reply('Lütfen geçerli bir miktar belirtiniz.');
    }
    
    if (Number(miktar) < 0) {
      return interaction.reply('Belirtilen miktar **0**dan küçük olamaz.');
    }
    
    const userID = interaction.user.id;
    
    const data = await User.findOne({ userID: userID });
    
    if (!data || data.bank < Number(miktar)) {
      return interaction.reply('Bankada yeterli sikke bulunmamaktadır.');
    }
    
    // Para transferi
    await User.findOneAndUpdate(
      { userID: userID },
      {
        $inc: {
          bank: -Number(miktar),
          cash: Number(miktar)
        }
      },
      { upsert: true }
    );
    
    interaction.reply(`Bankanızdan **${util.formatNumber(Number(miktar))} Sikke** çekildi.`);
    
  },
};