const discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("temizle")
    .setDescription("belirttiğiniz kanalda belirttiğiniz miktarda mesaj silersiniz.")
    .addChannelOption((option) =>
      option
        .setName("kanal")
        .setDescription("Kanal seç.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("miktar")
        .setDescription("Miktar Belirt.")
        .setMinValue(1)
        .setMaxValue(300)
        .setRequired(true)
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    if (!interaction.member.roles.cache.has(config.roles.Yetkili))
      return interaction.reply({ content: `Bu komutu sadece <@&${config.roles.Yetkili}> kullanabilir.`, ephemeral: true });

    const channelName = interaction.options.getChannel("kanal");
    const miktar = interaction.options.getInteger("miktar");

    if (miktar < 1 || miktar > 100)
      return interaction.reply({ content: "Minimum 1, maksimum 100 mesaj silebilirsin.", ephemeral: true });

    await channelName.bulkDelete(miktar, true).catch(() => {});

    const embed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setDescription(`✅ ${interaction.user} tarafından ${channelName} kanalında **${miktar}** adet mesaj silindi.`)
      .setTimestamp()
      .setFooter({ text: 'Chamber of Secrets Roleplay' });

    await interaction.reply({ embeds: [embed] });

    const logEmbed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setDescription(`:page_with_curl: ___***Mesaj Log***___\n${interaction.user} adlı yetkili ${channelName} kanalında **${miktar}** mesaj sildi.`)
      .setTimestamp()
      .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay' });

    const logChannel = client.channels.cache.get(config.logs.temizlelog);
    if (logChannel) logChannel.send({ embeds: [logEmbed] });
  },
};
