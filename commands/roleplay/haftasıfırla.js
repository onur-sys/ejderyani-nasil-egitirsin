const util = require('../../utils/util.js');
const User = require('../../models/User.js');
const config = require('../../config.json');
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("haftasıfırla")
    .setDescription("haftalık güncel roleplay listesini sıfırlarsınız."),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    if (!interaction.member.roles.cache.has(config.roles.Yetkili)) {
      return interaction.reply(`Bu komutu sadece <@&${config.roles.Yetkili}> kullanabilir.`);
    }
    
    // Veriyi çek ve kontrol et
    const userCount = await User.countDocuments({ rppuan: { $gt: 0 } });
    
    if (userCount === 0) return interaction.reply('Sıfırlanacak veri bulunamadı.');
    
    // Bütün rppuan'ları 0 yap
    await User.updateMany(
      { rppuan: { $gt: 0 } },
      { $set: { rppuan: 0 } }
    );
    
    const addcoinsEmbed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setDescription(`**Ejderhanı Nasıl Eğitirsin Roleplay**\n\n**Bu hafta RP yapan tüm kullanıcıların RP verileri başarıyla sıfırlandı!**`)
      .setTimestamp()
      .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay' });
    
    await interaction.reply({ embeds: [addcoinsEmbed] });
    
    try {
      const developers = client.config.owners.map((owner) => client.users.cache.get(owner));
    
      for (const developer of developers) {
        developer?.send(`**${interaction.user.tag}** adlı yetkili haftalık RP listesini sıfırladı.`).catch(() => {});
      }
    } catch {}
  },
};
