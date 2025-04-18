const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const config = require('../../config.json');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("ck")
    .setDescription("kişiye ck atarsınız tüm veriler silinir.")
    .addUserOption((option) =>
    option
      .setName("kisi")
      .setDescription("CK atılacak kişiyi seç.")
      .setRequired(true)
  ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    if (!interaction.member.roles.cache.has(config.roles.Yetkili)) {
      return interaction.reply({
        content: `Bu komutu sadece <@&${config.roles.Yetkili}> kullanabilir.`,
        ephemeral: true
      });
    }
    
    const user = interaction.options.getUser('kisi');
    if (!user) return interaction.reply({ content: 'Bir kullanıcı belirtmelisin.', ephemeral: true });
    
    // Kullanıcıyı MongoDB'den çek
    const data = await User.findOne({ userID: user.id });
    
    if (!data) {
      return interaction.reply({ content: `Bu kişinin herhangi bir verisi yok.`, ephemeral: true });
    }
    
    // Kullanıcı datasını sil
    await User.deleteOne({ userID: user.id });
    
    interaction.reply({ content: `**${user.tag}** adlı kişinin tüm verileri MongoDB'den silindi. CK atıldı.`, ephemeral: true });
    }
};
