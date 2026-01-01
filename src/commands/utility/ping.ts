import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  ColorResolvable,
  Client,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check bot latency and status');

export async function execute(client: Client, interaction: ChatInputCommandInteraction) {
  const sent = await interaction.reply({
    content: '🏓 Pinging...',
    fetchReply: true,
  });

  const roundTripLatency = sent.createdTimestamp - interaction.createdTimestamp;
  const wsLatency = client.ws.ping;

  let color: ColorResolvable;
  let status: string;

  if (roundTripLatency < 200 && wsLatency < 200) {
    color = '#57F287';
    status = '🟢 Excellent';
  } else if (roundTripLatency < 500 && wsLatency < 500) {
    color = '#FEE75C';
    status = '🟡 Good';
  } else {
    color = '#ED4245';
    status = '🔴 Poor';
  }

  const uptime = formatUptime(client.uptime || 0);

  let lavalinkStatus = 'N/A';
  if (client.shoukaku) {
    const nodes = [...client.shoukaku.nodes.values()];
    if (nodes.length > 0) {
      const node = nodes[0];
      lavalinkStatus = node.state === 2 ? '🟢 Connected' : '🔴 Disconnected';
    }
  }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle('🏓 Pong!')
    .setDescription(`**Connection Status:** ${status}`)
    .addFields(
      {
        name: '📡 Round Trip Latency',
        value: `\`${roundTripLatency}ms\``,
        inline: true,
      },
      {
        name: '💓 WebSocket Ping',
        value: `\`${wsLatency}ms\``,
        inline: true,
      },
      {
        name: '⏱️ Uptime',
        value: `\`${uptime}\``,
        inline: true,
      },
      {
        name: '🎵 Lavalink',
        value: lavalinkStatus,
        inline: true,
      },
      {
        name: '🌐 Shard',
        value: `\`${interaction.guild?.shardId ?? 0}\``,
        inline: true,
      },
      {
        name: '📊 Memory',
        value: `\`${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\``,
        inline: true,
      }
    )
    .setFooter({
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp();

  await interaction.editReply({
    content: '',
    embeds: [embed],
  });
}

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}