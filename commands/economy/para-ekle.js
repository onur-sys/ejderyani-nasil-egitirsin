const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("para-ekle")
    .setDescription("Seçtiğiniz kişiye belirttiğiniz miktarda para eklersiniz.")
 .addUserOption((option) =>
      option.setName("kullanıcı").setDescription("Kullanıcı seç.").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("miktar")
        .setDescription("eklenecek miktar gir.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("eklenecek")
        .setDescription("eklenecek yeri seç")
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
         const eklenecek = interaction.options.getString("eklenecek");
   const miktar = interaction.options.getInteger("miktar");
    
   if (!miktar || isNaN(miktar)) {
    return interaction.reply('Lütfen geçerli bir miktar belirtiniz.');
  }
  
  if (Number(miktar) < 0) {
    return interaction.reply('Belirtilen miktar **0**dan küçük olamaz.');
  }
  
  const userID = user.id; // işlem yapılan kullanıcı
  const guildID = interaction.guild.id; // sunucu id
  
  if (eklenecek === 'banka') {
    await User.findOneAndUpdate(
      { userID: userID },
      { $inc: { bank: miktar } },
      { upsert: true }
    );
  
    interaction.reply(`**${user}** adlı kullanıcının Bankasına **${util.formatNumber(miktar)} Sikke** eklendi.`);
  }
  
  else if (eklenecek === 'cuzdan') {
    await User.findOneAndUpdate(
      { userID: userID },
      { $inc: { cash: miktar } },
      { upsert: true }
    );
  
    interaction.reply(`**${user}** adlı kullanıcının Cüzdanına **${util.formatNumber(miktar)} Sikke** eklendi.`);
  }
  
  else {
    return interaction.reply('Geçersiz bir seçenek belirttiniz. Lütfen sadece "Cüzdan" veya "Banka" seçeneklerinden birini kullanın.');
  }
  
  // Log mesajı
  try {
    const developers = client.config('owners').map((owner) => client.users.cache.get(owner));
  
    for (const developer of developers) {
      developer?.send(`**${user.tag}** adlı kullanıcıya **${miktar}** Sikke para eklendi.\n\nEkleyen Kişi: **${interaction.user.tag}**`).catch(() => {});
    }
  } catch {}
    }
  },
};