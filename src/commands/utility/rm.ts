import { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  TextChannel,
  ColorResolvable,
  Client
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('rm')
  .setDescription('Delete messages from the current channel')
  .addIntegerOption(option =>
    option
      .setName('amount')
      .setDescription('Number of messages to delete (1-100)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100)
  )
  .setDMPermission(false);

export async function execute(client: Client, interaction: ChatInputCommandInteraction) {
  const adminIds = process.env.ADMIN_IDS?.split(',') || [];
  if (!adminIds.includes(interaction.user.id)) {
    return interaction.reply({
      content: '❌ You do not have permission to use this command!',
      ephemeral: true
    });
  }
  const amount = interaction.options.getInteger('amount', true);
  const channel = interaction.channel as TextChannel;

  if (!channel.permissionsFor(interaction.client.user!)?.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.reply({
      content: '❌ I don\'t have permission to delete messages in this channel!',
      ephemeral: true
    });
  }

  try {
    await interaction.deferReply({ ephemeral: true });

    const deletedMessages = await channel.bulkDelete(amount, true);

    const embed = new EmbedBuilder()
      .setColor('#57F287' as ColorResolvable)
      .setTitle('✅ Messages Deleted')
      .setDescription(`Successfully deleted **${deletedMessages.size}** message(s)`)
      .setTimestamp()
      .setFooter({ 
        text: `Deleted by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      });

    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    console.error('Error deleting messages:', error);
    
    const errorEmbed = new EmbedBuilder()
      .setColor('#ED4245' as ColorResolvable)
      .setTitle('❌ Error')
      .setDescription('Failed to delete messages. They might be older than 14 days.')
      .setTimestamp();

    if (interaction.deferred) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
}