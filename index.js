const config = require("./config.json");
const util = require("./utils/util.js");
const discord = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const recursive = require('recursive-readdir');
const { get } = require('lodash');
const { magentaBright, cyanBright , redBright, whiteBright} = require('colorette');
const { join } = require('path');
const { joinVoiceChannel } = require('@discordjs/voice');
const moment = require('moment');
require('moment/locale/tr'); // Türkçe dil desteği için
require('events').defaultMaxListeners = 50;

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
	discord.GatewayIntentBits.MessageContent,
	discord.GatewayIntentBits.GuildMembers,
  ],
});

client.cache = {
  events: new discord.Collection(),
  cooldowns: new discord.Collection(),
  aclikUyari: new discord.Collection(),
  susuzlukUyari: new discord.Collection()
};


client.config = (name) => {
  const config = JSON.parse(fs.readFileSync(join(__dirname, 'config.json')));
  return get(config, name);
};

const activities = [
    "Canım baboşum",
    "Babası Zoxy İle Görüşüyor"
];

client.once("ready", () => {
  console.log(`${magentaBright('[Zoxy Says]:')} ${redBright(`Tokene göre aktif olan Zoxy Says: `)} ${whiteBright(`${client.user.tag}`)}`);

	function updateActivity() {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(randomActivity);
    }
    updateActivity();
    setInterval(updateActivity, 5 * 1000);

  console.log(`${magentaBright('[Zoxy Says]:')} ${redBright(`Veritabanı bağlantısı başarıyla kuruldu!`)}`);

  const guild = client.guilds.cache.get("814547070357864488");
  if (!guild) return console.log("Guild bulunamadı!");

  joinVoiceChannel({
      channelId: "1360314971816329226",
      guildId: "814547070357864488",
      adapterCreator: guild.voiceAdapterCreator
  });

  console.log("Ses kanalına bağlanıldı.");

  const mongooseConnect = require('./database/mongoose');
  mongooseConnect();
});

client.commands = new discord.Collection();

const commandsPath = path.join(__dirname, "commands");

// config.json'daki izinli klasörler
const allowedFolders = config.allowedFolders;

const commandFolders = fs.readdirSync(commandsPath).filter(folder => allowedFolders.includes(folder));

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
  }
}

recursive(path.join(__dirname, 'events'), (err, files) => {
  if (err) console.error(err);
  else {
      for (const filePath of files) {
          const event = require(filePath);
          event.filePath = filePath;

          client.on(event.name, (...args) => event.execute(client, ...args));
          client.cache.events.set(event.name, event);
      }
      console.log(
          `${magentaBright('[Zoxy Says]:')} ${cyanBright(
              `${client.cache.events.size} Adet Dinleyici Yüklendi`
          )}`
      );
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(client, interaction);
  } catch (err) {
    console.log(err);
    await interaction.reply({
      content: "Bu komut yürütülürken bir hata oluştu babama danış...",
      ephemeral: true,
    });
  }
});


// Döviz aldığında dönecek event


//market komutu
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  const test = interaction.user.id;
  if (interaction.customId === 'market') {
    const selected = interaction.values[0];

    if (selected === 'kazan-marketi') {
      const balanceEmbed = new discord.EmbedBuilder()
      .setColor("#9c0306")
      .setAuthor({
        name: 'Eᴊᴅᴀʀʜᴀɴɪ Nᴀꜱɪʟ EɢɪᴛɪʀꜱɪɴRoleplay Kazan Marketi',
        iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
        url: 'https://discord.com'
      })
      .addFields(
        Object.entries(client.config('kazanlar')).map(([araç, fiyat]) => {
          const oldname = araç;
          return {
            name: `__${araç}__`,
            value: `**Fiyat: \`${util.formatNumber(fiyat) + ' Galleon'}\`\nSatın Al: \`/satın-al ${oldname}\`**`,
            inline: true
          };
        })
      )
    interaction.reply({
      embeds: [balanceEmbed]
    });
      }

      if (selected === 'supurge-marketi') {
        const balanceEmbed = new discord.EmbedBuilder()
                                        .setColor("#9c0306")
                                        .setAuthor({
                                          name: 'Eᴊᴅᴀʀʜᴀɴɪ Nᴀꜱɪʟ EɢɪᴛɪʀꜱɪɴRoleplay Süpürge Marketi',
                                          iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
                                          url: 'https://discord.com'
                                        })
                                        .addFields(
                                          Object.entries(client.config('supurgeler')).map(([ev, fiyat]) => {
                                              const oldname = ev;
                                              return {
                                                  name: `__${ev}__`,
                                                  value: `**Fiyat: \`${util.formatNumber(fiyat) + ' Galleon'}\`\nSatın Al: \`/mülk-al ${oldname}\`**`,
                                                  inline: true
                                              };
                                          })
                                      )
                                      interaction.reply({
                                        embeds: [balanceEmbed]
                                      });
        }
        if (selected === 'emlak-marketi') {
          const balanceEmbed = new discord.EmbedBuilder()
                                          .setColor("#9c0306")
                                          .setAuthor({
                                            name: 'Eᴊᴅᴀʀʜᴀɴɪ Nᴀꜱɪʟ EɢɪᴛɪʀꜱɪɴRoleplay Emlak Marketi',
                                            iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
                                            url: 'https://discord.com'
                                          })
                                          .addFields(
                                            Object.entries(client.config('evlerim')).map(([ozelarac, fiyat]) => {
                                                const oldname = ozelarac;
                                                return {
                                                    name: `__${ozelarac}__`,
                                                    value: `**Fiyat: \`${util.formatNumber(fiyat) + ' Galleon'}\`\nSatın Al: \`/mülk-al ${oldname}\`**`,
                                                    inline: true
                                                };
                                            })
                                        )
                                        interaction.reply({
                                          embeds: [balanceEmbed]
                                        });
          }
          if (selected === 'asa-marketi') {
            const balanceEmbed = new discord.EmbedBuilder()
                                            .setColor("#9c0306")
                                            .setAuthor({
                                              name: 'Eᴊᴅᴀʀʜᴀɴɪ Nᴀꜱɪʟ EɢɪᴛɪʀꜱɪɴRoleplay Asa Marketi',
                                              iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
                                              url: 'https://discord.com'
                                            })
                                            .addFields(
                                              Object.entries(client.config('asalar')).map(([motor, fiyat]) => {
                                                  const oldname = motor;
                                                  return {
                                                      name: `__${motor}__`,
                                                      value: `**Fiyat: \`${util.formatNumber(fiyat) + ' Galleon'}\`\nSatın Al: \`/mülk-al ${oldname}\`**`,
                                                      inline: true
                                                  };
                                              })
                                          )
                                          interaction.reply({
                                            embeds: [balanceEmbed]
                                          });
            }
            if (selected === 'hayvan-marketi') {
              const balanceEmbed = new discord.EmbedBuilder()
                                              .setColor("#9c0306")
                                              .setAuthor({
                                                name: 'Eᴊᴅᴀʀʜᴀɴɪ Nᴀꜱɪʟ EɢɪᴛɪʀꜱɪɴRoleplay Hayvan Marketi',
                                                iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
                                                url: 'https://discord.com'
                                              })
                                              .addFields(
                                                Object.entries(client.config('petler')).map(([pet, fiyat]) => {
                                                    const oldname = pet;
                                                    return {
                                                        name: `__${pet}__`,
                                                        value: `**Fiyat: \`${util.formatNumber(fiyat) + ' Galleon'}\`\nSatın Al: \`/satın-al ${oldname}\`**`,
                                                        inline: true
                                                    };
                                                })
                                            )
                                            interaction.reply({
                                              embeds: [balanceEmbed]
                                            });
              }
      
  }
});

client.on("guildMemberAdd", (hos) => {
  if(!client.db.set(`${hos.id}.baslangic_parasi_verildi`)){
    client.db.add(`dolar_${hos.guild.id}_${hos.id}`, 3000);
    client.db.add(`${hos.id}.baslangic_parasi_verildi`, true);
  }

  const silah = client.db.get(`${hos.id}.status.silah`);
    if (silah) {
        const silahSayi = client.db.get(`${hos.id}.envanter.silah.${silah}.miktar`);
        if (silahSayi < 1) {
            client.db.delete(`${hos.id}.status.silah`);
        }
    }
});

//ticket olusturma
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ticket') {
        const row = new discord.ActionRowBuilder().addComponents(
            new discord.StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Bir kategori seçin...')
                .addOptions([
                    {
                        label: 'Rol Başvuru',
                        value: 'Rol Başvuru',
                    },
                    {
                        label: 'Destek',
                        value: 'Destek',
                    }
                ])
        );

        const embed = new discord.EmbedBuilder()
            .setTitle('Eᴊᴅᴀʀʜᴀɴɪ Nᴀꜱɪʟ Eɢɪᴛɪʀꜱɪɴ - Dᴇꜱᴛᴇᴋ Sɪꜱᴛᴇᴍɪ')
            .setDescription('<:settings:1360900341037793290>  ・ \`ᴛɪᴄᴋᴇᴛ ꜱɪꜱᴛᴇᴍɪ:\` <:globe:1360900143477686432> \n <:info:1360900146266767460>  ・ \`ꜱᴜɴᴜᴄᴜ ʙɪʟɢɪ:\` <#815273380408197120> \n\nLütfen aşağıdaki menüden ihtiyacınıza göre bir kategori seçin.')
            .setImage('https://cdn.discordapp.com/icons/814547070357864488/a_3a164d425067c1b750572a6c3702af26.gif?size=1024')
            .setFooter({ 
              text: '・ Eᴊᴅᴀʀʜᴀɴɪ Nᴀꜱɪʟ Eɢɪᴛɪʀꜱɪɴ ・ Dᴇꜱᴛᴇᴋ Sɪꜱᴛᴇᴍɪ', 
              iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
              url: 'https://discord.com'
            });            
          
          

        await interaction.reply({ embeds: [embed], components: [row] });
    }
});

//ticket select
client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return;

    const { customId, user, values } = interaction;

    if (customId === 'select') {
        const selectedCategory = values[0];
        // Ticket oluşturma ve gönderme kodları...
        try {
             let channelName = `ticket-${interaction.user.tag}`;  // 'const' yerine 'let' kullanmalısınız

if (channelName.length > 100) {
    channelName = channelName.substring(0, 100);
}
        const categoryId = '1360898227708235906'; // Buraya kategorinin ID'sini ekleyin.

const guild = client.guilds.cache.get('814547070357864488');
const channel = await guild.channels.create({
	name: channelName,
    type: 0,
    parent: '1360898227708235906'
});

            const closeButton = new discord.ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('ᴋᴀᴘᴀᴛ')
                .setEmoji("<a:discordoff:1360900129112199312>")
                .setStyle("Primary");
            const backuputton = new discord.ButtonBuilder()
                .setCustomId('backup_ticket')
                .setLabel('ʏᴇᴅᴇᴋ ᴀʟ')
                .setEmoji("<:ReplayCloud:1360902091081519267>")
                .setStyle("Primary"); 

            const notifyButton = new discord.ButtonBuilder()
                .setCustomId('notify_ticket')
                .setLabel('ʙɪʟᴅɪʀɪᴍ')
                .setEmoji("<:announce:1360900118383034499>")
                .setStyle("Primary");

            const row = new discord.ActionRowBuilder()
                .addComponents(closeButton,backuputton,notifyButton);

                const test = `${user}`;
                channel.send(test)
                  .then(sentMessage => {
                    // Mesajı gönderdikten sonra geri sil
                    sentMessage.delete();
                  })
                  .catch(error => {
                    console.error('Mesaj gönderilirken bir hata oluştu:', error);
                  });
            const avatarURL = user.avatarURL({ format: 'png', dynamic: true, size: 1024 });
            const embed = new discord.EmbedBuilder()
                .setTitle(`**Eᴊᴅᴀʀʜᴀɴɪ Nᴀꜱɪʟ Eɢɪᴛɪʀꜱɪɴ - Dᴇꜱᴛᴇᴋ Sɪꜱᴛᴇᴍɪ**`)
                .setDescription(`
                ・ Lütfen yetkililerimizin mesaj yazmasını beklemeden sorununuzu anlatınız. \n

                ・ \`ᴋᴜʟʟᴀɴıᴄı:\` ${user} \n
                ・ \`ᴅᴇsᴛᴇᴋ ᴋᴀᴛᴇɢᴏʀɪsɪ: ${selectedCategory}\`
                `)
                .setImage('https://cdn.discordapp.com/icons/814547070357864488/a_3a164d425067c1b750572a6c3702af26.gif?size=1024')
                .setThumbnail(avatarURL);

            channel.send({ embeds: [embed], components: [row] });

            const now = moment().locale('tr');
            const kanalolustu = new discord.EmbedBuilder()
            .setAuthor({
              name: 'Eᴊᴅᴀʀʜᴀɴɪ Nᴀꜱɪʟ Eɢɪᴛɪʀꜱɪɴ - Dᴇꜱᴛᴇᴋ Sɪꜱᴛᴇᴍɪ',
              iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
              url: 'https://discord.com'
            })
                .setDescription(`
                ・ \`ᴋᴜʟʟᴀɴıᴄı:\` ${user}
                ・ \`ᴅᴇsᴛᴇᴋ ᴋᴀɴᴀʟı:\` <#${channel.id}>
                ・ \`ᴛᴀʀɪʜ: ${now.format('D MMMM YYYY HH:mm')}\`
                `);

            interaction.reply({ embeds: [kanalolustu], ephemeral: true });
        } catch (error) {
            console.error("Kanal oluşturulamadı:", error);
        }
    }
});

//ticket kapanması - yedeği - bildirim
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const { customId, member } = interaction;

    if (customId === 'close_ticket') {
      const roleId = '838939947862851604'; // Yetkili rol ID'sini buraya ekle
      if (member.roles.cache.has(roleId)) {
        const test = interaction.user;
        const avatarURL = test.avatarURL({ format: 'png', dynamic: true, size: 1024 });
          interaction.reply({ 
              embeds: [{ 
                  color: 0xFF0000, 
                  title: `${avatarURL} ${test}`
              }], 
              ephemeral: true 
          });
  
          // Change the channel name
          interaction.channel.setName('kanal-siliniyor')
              .then(() => {
                  // Wait for 5 seconds
                  setTimeout(() => {
                      // Delete the channel
                      interaction.channel.delete();
                  }, 5000);
              })
              .catch(console.error);
      } else {
          interaction.reply({ content: 'Bu ticketi kapatma yetkiniz yok!', ephemeral: true });
      }
  }
  if (customId === 'backup_ticket') {
    const channel = interaction.channel;
    const fetchAllMessages = async (channel) => {
        let allMessages = [];
        let lastId;

        while (true) {
            const options = { limit: 100 };
            if (lastId) {
                options.before = lastId;
            }

            const fetchedMessages = await channel.messages.fetch(options);
            if (fetchedMessages.size === 0) {
                break;
            }
            allMessages = allMessages.concat(Array.from(fetchedMessages.values()));
            lastId = fetchedMessages.last().id;
        }

        return allMessages;
    };

    const messages = await fetchAllMessages(channel);
    const reversedMessages = messages.reverse(); // Ensure messages are in chronological order
    const generateHTML = (messages) => {
        const html = messages.map(message => {
            const author = message.author;
            const member = message.member;
            const color = member && member.displayColor ? `#${member.displayColor.toString(16)}` : '#FFFFFF';
            let roleEmoji = '';
            if (member) {
                // İterate through the roles and find the first one with an icon (if any)
                const rolesWithEmojis = member.roles.cache.filter(role => role.icon);
                if (rolesWithEmojis.size > 0) {
                    // If there's a role with an emoji, convert the first one to a string
                    const role = rolesWithEmojis.first();
                    roleEmoji = `<img src="https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.png" alt="Role Icon" class="role-icon">`;
                }
            }

            const content = message.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const timestamp = moment(message.createdTimestamp).format('D MMMM YYYY HH:mm');

            return `
            <div>
            
            </div>
                <div class="message">
                    <img src="${author.displayAvatarURL({ dynamic: true, format: 'png', size: 64 })}" alt="${author.tag}" class="avatar">
                    <div class="content">
                        <header>
                            <span class="author" style="color:${color};">${author.username}</span>
                            <span class="role-emoji">${roleEmoji}</span>
                            <span class="time">${timestamp}</span>
                        </header>
                        <div class="text">${content}</div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Discord Chat Backup</title>
                <style>
                    body { font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #36393F; color: white; }
                    .message { display: flex; align-items: center; margin-bottom: 10px; }
                    .avatar { border-radius: 50%; width: 40px; height: 40px; }
                    .content { margin-left: 10px; flex-grow: 1; }
                    .role-icon { width: 20px; height: 20px; vertical-align: middle;  }
                    header { display: flex; align-items: baseline; }
                    .author { font-style: font-family:Whitney, &#x27;Source Sans Pro&#x27;, ui-sans-serif, system-ui, -apple-system, &#x27;system-ui&#x27;, &#x27;Segoe UI&#x27;, Roboto, &#x27;Helvetica Neue&#x27;, Arial,
                      sans-serif, &#x27;Apple Color Emoji&#x27;, &#x27;Segoe UI Emoji&#x27;, &#x27;Segoe UI Symbol&#x27;, &#x27;Noto Color Emoji&#x27;;
                   margin-right: 5px; }
                    .role-emoji { margin-right: 5px;}
                    .time { color: #72767d;
                      font-size: 12px;
                      margin-left: 3px; }
                    .text { margin-top: 2px; }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;
    };

    const htmlContent = generateHTML(reversedMessages);
    const date = new Date().toISOString().split('T')[0];
    const filename = `backup-${channel.id}-${date}.html`;
    const filepath = path.join(__dirname, 'backups', filename);

    fs.writeFile(filepath, htmlContent, async (err) => {
      if (err) {
          console.error(err);
          return interaction.reply({ content: 'Ticket yedeği alınamadı, botta bir sorun oluştu.', ephemeral: true });
      }
  
      // HTML dosyasını embed veya dosya olarak gönder
      const file = new discord.AttachmentBuilder(filepath);
  
      // Önce interaction'a bilgi ver
      await interaction.reply({ content: 'Ticket yedeği başarılı bir şekilde alındı. Dosya gönderiliyor...', ephemeral: true });
  
      // Sonra aynı kanala dosyayı gönder
      interaction.channel.send({
          content: '📦 Ticket yedeği dosyası aşağıda:',
          files: [file]
      });
  });
}
  if (customId === 'notify_ticket') {

    const test = `<@&838939947862851604>`;
    interaction.channel.send({test, ephemeral: true}).then(sentMessage => {sentMessage.delete();}).catch(error => {console.error('Mesaj gönderilirken bir hata oluştu:', error);});
    await interaction.reply({ content: 'Bildirim mesajı yöneticilere iletilmiştir.', ephemeral: true });
  }
});

client.on('error', async (error) => {
  console.error('Bir hata oluştu:', error);
  try {
      // Botu yeniden başlatmak için bir işlem yapılabilir
      console.log('Bot yeniden başlatılıyor...');
      await client.destroy();
      await client.login(config.token);
      console.log('Bot başarıyla yeniden başlatıldı!');
  } catch (err) {
      console.error('Bot yeniden başlatılırken bir hata oluştu:', err);
  }
});


client.login(config.token);
 require("./deployCommands.js")