const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("para-sil")
    .setDescription("Seçtiğiniz kişiden belirttiğiniz miktarda para silersiniz.")
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
                name: "Cüzdan",
                value: "cuzdan"
            },
            {
                name: "Banka",
                value: "banka"
            }
        )
    ),
  /**
   * @miktarm {discord.Client} client
   * @miktarm {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    if (!interaction.member.roles.cache.has(client.config(`roles.Yetkili`))) {
      return interaction.reply(`Bu komutu sadece <@&${client.config(`roles.Yetkili`)}> kullanabilir.`);
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
  
  const userID = user.id;
  const guildID = interaction.guild.id;
  
  if (silinecek === 'banka') {
    await User.findOneAndUpdate(
      { userID: userID },
      { $inc: { bank: -Number(miktar) } },
      { upsert: true }
    );
  
    interaction.reply(`**${user}** adlı kullanıcının Bankasından **${util.formatNumber(miktar)} Sikke** silindi.`);
  }
  
  else if (silinecek === 'cuzdan') {
    await User.findOneAndUpdate(
      { userID: userID },
      { $inc: { cash: -Number(miktar) } },
      { upsert: true }
    );
  
    interaction.reply(`**${user}** adlı kullanıcının Cüzdanından **${util.formatNumber(miktar)} Sikke** silindi.`);
  }
  
  else {
    return interaction.reply('Geçersiz bir seçenek belirttiniz. Lütfen sadece "Cüzdan" veya "Banka" seçeneklerinden birini kullanın.');
  }
  
  // Log Mesajı
  try {
    const developers = client.config('owners').map((owner) => client.users.cache.get(owner));
  
    for (const developer of developers) {
      developer?.send(`**${user.tag}** adlı kullanıcının ${silinecek} içerisinden ${miktar} Sikke silindi.\n\nSilen Kişi: **${interaction.user.tag}**`).catch(() => {});
    }
  } catch {}
              }
  },
};