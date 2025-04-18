const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("maaş-ekle")
    .setDescription("Belirli bir role maaş eklersin.")
    .addRoleOption((option) =>
      option.setName("rol").setDescription("Maaş atanacak rol.").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("miktar").setDescription("Verilecek maaş miktarı.").setRequired(true)
    ),

  async execute(client, interaction) {
    const configPath = path.join(__dirname, "../../config.json");
    const yetkiliRolID = require(configPath).roles.Yetkili;

    if (!interaction.member.roles.cache.has(yetkiliRolID)) {
      return interaction.reply({
        content: `Bu komutu sadece <@&${yetkiliRolID}> kullanabilir.`,
        ephemeral: true,
      });
    }

    const miktarStr = interaction.options.getString("miktar");
    const rol = interaction.options.getRole("rol");

    const miktar = Number(miktarStr);
    if (isNaN(miktar) || miktar < 0) {
      return interaction.reply({
        content: "Lütfen geçerli bir sayı girin.",
        ephemeral: true,
      });
    }

    // Config oku ve güncelle
    const rawData = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(rawData);

    if (!config.maaşlar || typeof config.maaşlar !== "object") {
      config.maaşlar = {};
    }

    config.maaşlar[rol.id] = miktar;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    return interaction.reply({
      content: `✅ ${rol} rolü için **${miktar} Sikke** maaş listesine başarıyla eklendi.`,
    });
  },
};
