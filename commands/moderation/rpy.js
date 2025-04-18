const discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("rpy")
    .setDescription("Belirttiğin kullanıcıyı belirtilen süre kadar cezalandırır.")
    .addUserOption(option =>
      option.setName("kullanıcı").setDescription("Cezalandırılacak kullanıcıyı seç.").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("dakika").setDescription("Kaç dakika ceza verilecek?").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("sebep").setDescription("Ceza sebebini belirt.").setRequired(true)
    ),

  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    if (!interaction.member.roles.cache.has(config.roles.Yetkili))
      return interaction.reply({ content: `Bu komutu sadece <@&${config.roles.Yetkili}> kullanabilir.`, ephemeral: true });

    const user = interaction.options.getUser("kullanıcı");
    const member = interaction.guild.members.cache.get(user.id);
    const dakika = interaction.options.getInteger("dakika");
    const sebep = interaction.options.getString("sebep");

    const cezaRol = config.roles.rpy; // config.json'a ekle "CezaRol": "ROL_ID"

    if (!member) return interaction.reply({ content: "Belirtilen kullanıcı bulunamadı.", ephemeral: true });

    await member.roles.add(cezaRol).catch(() => {});

    await interaction.reply({ content: `${user} adlı kullanıcıya **${dakika} dakika** ceza verildi. Sebep: ${sebep}` });

    const logEmbed = new discord.EmbedBuilder()
      .setColor("DarkRed")
      .setDescription(`> ${user} adlı kullanıcıya ceza verildi!\n\n**Süre:** ${dakika} dakika\n**Sebep:** ${sebep}`)
      .setTimestamp()
      .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay' });

    const logChannel = client.channels.cache.get(config.logs.cezalog); // config.json'a "cezalog" ekle
    if (logChannel) logChannel.send({ embeds: [logEmbed] });

    // Süre dolunca ceza rolünü kaldır
    setTimeout(async () => {
      await member.roles.remove(cezaRol).catch(() => {});

      const bitisEmbed = new discord.EmbedBuilder()
        .setColor("Green")
        .setDescription(`> ${user} adlı kullanıcının ceza süresi doldu ve ceza rolü kaldırıldı.`)
        .setTimestamp();

      if (logChannel) logChannel.send({ embeds: [bitisEmbed] });
    }, dakika * 60 * 1000);
  }
};
