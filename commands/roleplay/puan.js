const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("rp-puan")
    .setDescription("puan bakarsınız.")
    .addUserOption((option) =>
      option
        .setName("kullanıcı")
        .setDescription("puan görüntülemek için bir kullanıcı seçin")
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const user = interaction.options.getUser("kullanıcı");
    const userID = user ? user.id : interaction.user.id;

// Kullanıcı Verisini Çek
const data = await User.findOne({ userID: userID });

const puan = data ? data.rppuan : 0;
const toppuan = data ? data.toprppuan : 0;

// Sıralama
const topUsers = await User.find().sort({ rppuan: -1 }).limit(10);

const kisiyeOzelListe = topUsers.map((x, index) => {
  if (x.userID === userID) {
    return `${index + 1}`;
  }
  return null;
}).filter(x => x !== null);

// Button Yapısı
let button = new discord.ActionRowBuilder().addComponents(
  new discord.ButtonBuilder()
    .setCustomId("puan")
    .setLabel(`Haftalık Puan: ${puan}`)
    .setEmoji("🪄")
    .setStyle(discord.ButtonStyle.Secondary),
  
  new discord.ButtonBuilder()
    .setCustomId("toppuan")
    .setLabel(`Toplam Puan: ${toppuan}`)
    .setEmoji("📈")
    .setStyle(discord.ButtonStyle.Secondary),

  new discord.ButtonBuilder()
    .setCustomId("puansira")
    .setLabel(`Puan Sıralaması: ${kisiyeOzelListe[0] || 'Yok'}`)
    .setEmoji("🏆")
    .setStyle(discord.ButtonStyle.Secondary)
);

await interaction.reply({
  components: [button]
});
  },
};

