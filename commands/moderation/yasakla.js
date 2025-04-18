const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("yasakla")
    .setDescription("Seçtiğiniz kişiyi banlarsınız.")
    .addUserOption((option) =>
      option.setName("kullanıcı").setDescription("Banlanacak kullanıcıyı seç.").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("sebep").setDescription("Ban sebebini gir.").setRequired(true)
    ),

  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const user = interaction.options.getUser("kullanıcı");
    const reason = interaction.options.getString("sebep");

    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: "Bu kullanıcı sunucuda bulunamadı.", ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: "Bu kullanıcıyı banlayamıyorum. Yetkim yetersiz olabilir.", ephemeral: true });
    }

    await member.ban({ reason: reason }).catch(() => {});

    const banEmbed = new discord.EmbedBuilder()
      .setColor("Red")
      .setTitle("🚫 Kullanıcı Yasaklandı")
      .setDescription(`
**Yasaklanan Kişi:** ${user.tag} (${user.id})
**Yasaklayan Yetkili:** ${interaction.user.tag}
**Sebep:** ${reason}
`)
      .setImage('https://cdn.discordapp.com/attachments/917119698850705429/1361770768442327060/thor-thor-infinity-war.gif?ex=67fff75b&is=67fea5db&hm=9389b7f8f1451b7983ace00b147266a9fdeb97791faa6bbf9393982e0b835eb3&')
      .setTimestamp();

    await interaction.reply({ embeds: [banEmbed] });
  },
};
