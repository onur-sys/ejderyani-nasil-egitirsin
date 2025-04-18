const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("isimdeğiştir")
    .setDescription("Belirttiğiniz kişinin ismini değiştirirsiniz.")
    .addUserOption((option) =>
      option.setName("kullanıcı").setDescription("Kullanıcı seç.").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("isim")
        .setDescription("yeni isim seç.")
        .setRequired(true)
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    if (
      !interaction.member.roles.cache.has(client.config('roles.RolDenetmeni')) &&
      !interaction.member.roles.cache.has(client.config('roles.Yetkili'))
    ) {
      return interaction.reply(`Bu komutu sadece <@&${client.config('roles.RolDenetmeni')}> ve <@&${client.config('roles.Yetkili')}> kullanabilir.`);
    } else {
    let user = interaction.options.getUser("kullanıcı");
    let newNickname = interaction.options.getString("isim");

      let member = interaction.guild.members.cache.get(user.id);

      await member
        .setNickname(newNickname)
        .then(async () => {
          const nicknameEmbed = new discord.EmbedBuilder()
           .setColor("#9c0306")
            .setDescription(
              `✅ Başarılı bir şekilde **<@!${user.id}>** adlı kullanıcının ismi **${newNickname}** olarak değiştirildi.`
            )
			.setTimestamp()
	  .setFooter({ text: 'Ejderhanı Nasıl Eğitirsin Roleplay'});

          await interaction.reply({
            embeds: [nicknameEmbed],
          });
        })
        .catch(async (err) => {
          console.log(err);
          await interaction.reply({
            content: "Bu komut yürütülürken bir hata oluştu...",
            ephemeral: true,
          });
        });
      }
  },
};