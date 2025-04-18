const { Client } = require('discord.js');
const User = require('../models/User.js');
const config = require('../config.json');
const discord = require("discord.js");

module.exports = {
    name: 'messageDelete',
    /**
     * @param {Client} client
     */
    async execute(client, message) {
        if (message.author.bot) return;

        const categoryIDs = config.category; // config.json'daki kategori arrayi
    
        if (!categoryIDs.includes(message.channel.parentId)) return; // Eğer o kategoride değilse çık
    
        const score = message.content.length;
        const userID = message.author.id;
      
      // Veriyi çekelim
      const userData = await User.findOne({ userID: userID });
    
      if (!userData) return; // Kullanıcı yoksa çık
    
      let newRpPuan = userData.rppuan - score;
      let newTopRpPuan = userData.toprppuan - score;
    
      if (newRpPuan < 0) newRpPuan = 0;
      if (newTopRpPuan < 0) newTopRpPuan = 0;
    
      // Veriyi güncelle
      await User.findOneAndUpdate(
        { userID: userID },
        {
          $set: {
            rppuan: newRpPuan,
            toprppuan: newTopRpPuan
          }
        }
      );
    
      const logEmbed = new discord.EmbedBuilder()
        .setColor("#0155b6")
        .setDescription(
          `✅ :page_with_curl: ___***RP Log***___\n\n` +
          `**RP Silen Kişi:** <@${userID}>\n` +
          `**Silinen toplam roleplay karakter:** ${score}`
        )
        .setTimestamp()
        .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay' });
    
      const logChannel = client.channels.cache.get('917119698850705429');
      if (logChannel) logChannel.send({ embeds: [logEmbed] });
    }
};