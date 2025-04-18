const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
  } = require('discord.js');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('roldekiler')
      .setDescription('Belirttiğin roldeki kişileri listeler.')
      .addRoleOption(option =>
        option.setName('rol')
          .setDescription('Listelenecek rolü seç.')
          .setRequired(true)
      ),
  
    async execute(client, interaction) {
      const role = interaction.options.getRole('rol');
  
      // Üyeleri fetchle cache'e al
      await interaction.guild.members.fetch();
  
      const membersWithRole = role.members.map(member => member.user);
  
      if (membersWithRole.length === 0) {
        return interaction.reply({ content: 'Bu rolde hiç kullanıcı bulunamadı.', ephemeral: true });
      }
  
      const pageSize = 10;
      const totalPages = Math.ceil(membersWithRole.length / pageSize);
      let page = 0;
  
      const generateEmbed = (page) => {
        const start = page * pageSize;
        const end = start + pageSize;
        const currentMembers = membersWithRole.slice(start, end)
          .map((user, index) => `**${start + index + 1}.** <@${user.id}> (${user.tag})`)
          .join('\n');
  
        return new EmbedBuilder()
          .setColor('#9c0306')
          .setTitle(`${role.name} Rolündeki Üyeler`)
          .setDescription(currentMembers)
          .setFooter({ text: `Sayfa ${page + 1} / ${totalPages} | Toplam Üye: ${membersWithRole.length}` });
      };
  
      const backButton = new ButtonBuilder()
        .setCustomId('back')
        .setLabel('⬅️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);
  
      const nextButton = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(totalPages <= 1);
  
      const row = new ActionRowBuilder().addComponents(backButton, nextButton);
  
      const msg = await interaction.reply({
        embeds: [generateEmbed(page)],
        components: [row],
        fetchReply: true
      });
  
      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000
      });
  
      collector.on('collect', async i => {
        if (i.user.id !== interaction.user.id)
          return i.reply({ content: 'Bu sayfa senin için değil.', ephemeral: true });
  
        if (i.customId === 'back') page--;
        if (i.customId === 'next') page++;
  
        backButton.setDisabled(page === 0);
        nextButton.setDisabled(page === totalPages - 1);
  
        await i.update({ embeds: [generateEmbed(page)], components: [row] });
      });
  
      collector.on('end', async () => {
        await msg.edit({ components: [] });
      });
    }
  };
  