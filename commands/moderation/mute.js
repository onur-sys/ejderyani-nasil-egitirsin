const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Seçtiğiniz kişiyi belirtilen süre boyunca susturur (timeout).")
    .addUserOption(option =>
      option.setName("kullanıcı").setDescription("Susturulacak kullanıcıyı seç.").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("dakika").setDescription("Kaç dakika mute atılacak?").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("sebep").setDescription("Mute sebebini gir.").setRequired(true)
    ),

  async execute(client, interaction) {
    const user = interaction.options.getUser("kullanıcı");
    const minute = interaction.options.getInteger("dakika");
    const reason = interaction.options.getString("sebep");

    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: "Bu kullanıcı sunucuda bulunamadı.", ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: "Bu kullanıcıya mute atamıyorum.", ephemeral: true });
    }

    await member.timeout(minute * 60 * 1000, reason);

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`✅ ${user} adlı kullanıcıya ${minute} dakika mute atıldı!\nSebep: ${reason}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
}
