const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("para-gönder")
    .setDescription("Seçtiğiniz arkadaşınıza para gönderirsiniz")
 .addUserOption((option) =>
      option.setName("kullanıcı").setDescription("Kullanıcı seç.").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("miktar")
        .setDescription("gönderilecek miktar gir.")
        .setRequired(true)
    ),
  /**
   * @miktarm {discord.Client} client
   * @miktarm {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const user = interaction.options.getUser("kullanıcı");
    let miktar = interaction.options.getInteger("miktar");

    if (!miktar || isNaN(miktar)) {
      return interaction.reply('Lütfen geçerli bir miktar belirtiniz.');
    }
    
    if (Number(miktar) < 0) {
      return interaction.reply('Belirtilen miktar **0**dan küçük olamaz.');
    }
    
    const userID = interaction.user.id; // parayı gönderen
    const hedefID = user.id; // parayı alan kişi (interaction.options.getUser vs olabilir)
    
    const gonderenData = await User.findOne({ userID: userID });
    
    if (!gonderenData || gonderenData.cash < Number(miktar)) {
      return interaction.reply('Yeterli miktarda sikke bulunmamaktadır.');
    }
    
    // Parayı düş - karşı tarafa ekle
    await User.findOneAndUpdate(
      { userID: userID },
      { $inc: { cash: -Number(miktar) } },
      { upsert: true }
    );
    
    await User.findOneAndUpdate(
      { userID: hedefID },
      { $inc: { bank: Number(miktar) } },
      { upsert: true }
    );
    
    interaction.reply(`**${user}** adlı kullanıcıya **${util.formatNumber(miktar)} Sikke** gönderildi.`);
    
  },
};