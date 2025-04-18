const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("puan-sil")
    .setDescription("Seçtiğiniz kişiden belirttiğiniz miktarda rp puan silersiniz.")
 .addUserOption((option) =>
      option.setName("kullanıcı").setDescription("Kullanıcı seç.").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("miktar")
        .setDescription("silinecek miktar gir.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("silecek")
        .setDescription("sa.")
        .setRequired(true)
        .setChoices(
            {
                name: "Haftalık",
                value: "haftalik"
            },
            {
                name: "Toplam",
                value: "toplam"
            }
        )
    ),
  /**
   * @miktarm {discord.Client} client
   * @miktarm {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    if (!interaction.member.roles.cache.has(client.config(`roles.founder`) && client.config(`roles.Yetkili`))) {
      return interaction.reply(`Bu komutu sadece <@&${client.config(`roles.founder`)}> ve <@&${client.config(`roles.Yetkili`)}> kullanabilir.`);
    } else {
    const user = interaction.options.getUser("kullanıcı");
    const silinecek = interaction.options.getString("silecek");
    const miktar = interaction.options.getInteger("miktar");
    if (!miktar || isNaN(miktar)) {
      return interaction.reply('Lütfen geçerli bir miktar belirtiniz.');
  }
  
  if (Number(miktar) < 0) {
      return interaction.reply('Belirtilen miktar **0**dan küçük olamaz.');
  }
  
  let updateData = {};
  
  if (silinecek === 'toplam') {
      updateData = { $inc: { toprppuan: -Number(miktar) } };
  
      await User.findOneAndUpdate(
          { userID: user.id },
          updateData,
          { upsert: true }
      );
  
      await interaction.reply(`**${user}** adlı kullanıcının Aylık Puanından **${util.formatNumber(miktar)}** miktar toplam puan silindi.`);
  } else if (silinecek === 'haftalik') {
      updateData = { $inc: { rppuan: -Number(miktar) } };
  
      await User.findOneAndUpdate(
          { userID: user.id },
          updateData,
          { upsert: true }
      );
  
      await interaction.reply(`**${user}** adlı kullanıcının Haftalık Puanından **${util.formatNumber(miktar)}** miktar puan silindi.`);
  } else {
      return interaction.reply('Geçersiz bir seçenek belirttiniz. Lütfen sadece "Haftalık" veya "Toplam" seçeneklerinden birini kullanın.');
  }
  
  try {
      const developers = client.config('owners').map((owner) => client.users.cache.get(owner));
  
      for (const developer of developers) {
          developer?.send(
              `**${user.tag}** adlı kullanıcının **${silinecek}** puanından **${miktar}** roleplay puanı silindi.\n\nSilen Kişi: **${interaction.user.tag}**`
          ).catch(() => { });
      }
  } catch { }
              }
  },
};