const config = require("./config.json");
const { Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const fs = require("node:fs");
const path = require("node:path");
const { magentaBright, cyanBright, redBright } = require('colorette');

const commands = [];

const commandsPath = path.join(__dirname, "commands");

// config.json'dan izin verilen klasörleri al
const allowedFolders = config.allowedFolders;

const commandFolders = fs.readdirSync(commandsPath).filter(folder => allowedFolders.includes(folder));

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(config.token);

rest.put(Routes.applicationCommands(config.client_id), { body: commands })
  .then(() => {
    console.log(`${magentaBright('[Zoxy Says]:')} ${redBright(`Uygulama komutları başarıyla kaydedildi`)}`);
  })
  .catch((err) => {
    console.log(err);
  });
