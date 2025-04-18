const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("maaş-liste")
    .setDescription("Maaş listesine bakarsınız."),

  async execute(client, interaction) {
    const maaslar = config.maaşlar;

    if (!maaslar || Object.keys(maaslar).length === 0) {
      return interaction.reply({
        content: "📋 Maaş listesi boş gözüküyor.",
        ephemeral: true,
      });
    }

    let maasMetni = Object.entries(maaslar)
      .map(([rolID, miktar]) => `<@&${rolID}> ➔ **${miktar} Sikke**`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor("#9c0306")
      .setTitle("💰 Meslek Maaşları Listesi")
      .setDescription(maasMetni)
      .setTimestamp()
      .setFooter({ text: "Ejderhanı Nasıl Eğitirsin Roleplay" });

    await interaction.reply({ embeds: [embed] });
  },
};
