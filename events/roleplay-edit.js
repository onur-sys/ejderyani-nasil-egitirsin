const { Client } = require('discord.js');
const User = require('../models/User.js');
const config = require('../config.json');
const discord = require("discord.js");

module.exports = {
    name: 'messageUpdate',
    /**
     * @param {Client} client
     */
    async execute(client, oldMessage, newMessage) {
        
//rp düzenlendiğinde
if (oldMessage.author?.bot || newMessage.author?.bot) return;
if (!oldMessage.content || !newMessage.content) return;

const categoryIDs = config.category;
if (!categoryIDs.includes(oldMessage.channel.parentId)) return;

const eskiPuan = oldMessage.content.length;
const yeniPuan = newMessage.content.length;
const userID = oldMessage.author.id;

const fark = yeniPuan - eskiPuan; // sadece değişen karakter farkı kadar güncelle

await User.findOneAndUpdate(
  { userID: userID },
  {
    $inc: {
      rppuan: fark,
      toprppuan: fark
    }
  },
  { upsert: true }
);

const logEmbed = new discord.EmbedBuilder()
  .setColor("#0155b6")
  .setDescription(
    `✅ :page_with_curl: ___***RP Log***___\n\n` +
    `**RP Düzenleyen Kişi:** <@${userID}>\n` +
    `**İlk yaptığı RP karakter sayısı:** ${eskiPuan}\n` +
    `**Yeni düzenlediği RP karakter sayısı:** ${yeniPuan}\n` +
    `**Eklenen/Silinecek karakter farkı:** ${fark}`
  )
  .setTimestamp()
  .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay' });

const logChannel = client.channels.cache.get('917119698850705429');
if (logChannel) logChannel.send({ embeds: [logEmbed] });
    
}
};