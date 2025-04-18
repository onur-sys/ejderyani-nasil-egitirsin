const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const config = require('../../config.json');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("rolmodel-değiştir")
    .setDescription("rol model görünümünüzü değiştirirsiniz.")
    .addAttachmentOption(option =>
        option.setName('karakter_görünümü')
            .setDescription('Yüklemek için bir dosya seçin.')
            .setRequired(true)
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const userID = interaction.user.id;
    const karakter = interaction.options.getAttachment('karakter_görünümü');
    const karakter_gorunum = karakter.url;

    if (!karakter_gorunum)
      return interaction.reply({
        content: "Geçerli bir karakter görünümü dosyası yüklenmediği için işlem iptal edildi.",
        ephemeral: true
      });

    await User.findOneAndUpdate(
      { userID: userID },
      { $set: { rpmodel: karakter_gorunum } },
      { upsert: true }
    );

    return interaction.reply({
      content: `Karakter görünümünüz başarıyla değiştirildi.`,
      ephemeral: true
    });
  }
};
