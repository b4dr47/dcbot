import { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ChatInputCommandInteraction,
  ColorResolvable,
  Client
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Get information about a user')
  .addUserOption(option =>
    option
      .setName('target')
      .setDescription('The user to get info about')
      .setRequired(false)
  );

export async function execute(client: Client, interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser('target') || interaction.user;
  const member = interaction.guild?.members.cache.get(targetUser.id);
  const embed = new EmbedBuilder()
    .setColor('#5865F2' as ColorResolvable)
    .setTitle(`User Information: ${targetUser.username}`)
    .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: 'Username', value: targetUser.username, inline: true },
      { name: 'User ID', value: targetUser.id, inline: true },
      { name: 'Bot', value: targetUser.bot ? 'Yes' : 'No', inline: true },
      { 
        name: 'Account Created', 
        value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`,
        inline: false 
      }
    )
    .setTimestamp()
    .setFooter({ 
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL()
    });

  if (member?.joinedTimestamp) {
    embed.addFields({
      name: 'Joined Server',
      value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
      inline: false
    });
  }
  await interaction.reply({ embeds: [embed] });
}