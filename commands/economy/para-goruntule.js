const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("para-görüntüle")
    .setDescription("bakiyenize bakarsınız.")
    .addUserOption((option) =>
      option
        .setName("kullanıcı")
        .setDescription("bakiye görüntülemek için bir kullanıcı seçin")
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const user = interaction.options.getUser("kullanıcı");
const userID = user ? user.id : interaction.user.id;

// Kullanıcıyı çek
const data = await User.findOne({ userID: userID, guildID: interaction.guild.id });

// Eğer kullanıcı yoksa sıfır değer döndür
const para = data ? data.cash : 0;
const bankaAmount = data ? data.bank : 0;

const dolars = util.formatNumber(para);
const banks = util.formatNumber(bankaAmount);
      
const topUsers = await User.find({ guildID: interaction.guild.id }).sort({ money: -1 }).limit(10);

const kisiyeOzelListe = topUsers.map((x, index) => {
  if (x.userID === userID) {
    return `${index + 1}`;
  }
  return null;
}).filter(x => x !== null);

        let button = new discord.ActionRowBuilder().addComponents(
          new discord.ButtonBuilder()
            .setCustomId("para")
            .setLabel(`Cüzdan: ${dolars} Sikke`)
            .setEmoji("👛")
            .setStyle("Secondary"),
            new discord.ButtonBuilder()
            .setCustomId("bank")
            .setLabel(`Banka: ${banks} Sikke`)
            .setEmoji("🏦")
            .setStyle("Secondary"),
            new discord.ButtonBuilder()
            .setCustomId("sira")
			.setLabel(`Zenginlik sıralamasında ${kisiyeOzelListe}.`)
            .setEmoji("🏆")
            .setStyle("Secondary"),
        );
    let msg = await interaction.reply({
      components: [button]
    });
  },
};

