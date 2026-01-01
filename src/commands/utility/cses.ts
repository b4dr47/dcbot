import { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ChatInputCommandInteraction,
  ColorResolvable,
  Client
} from 'discord.js';

interface Problem {
  name: string;
  difficulty: string;
  url: string;
}

const problems: Record<string, Problem[]> = {
  graph: [
    { name: 'Shortest Routes I', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1671' },
    { name: 'Shortest Routes II', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1672' },
    { name: 'High Score', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1673' },
    { name: 'Flight Discount', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1195' },
    { name: 'Cycle Finding', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1197' },
    { name: 'Flight Routes', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1196' },
    { name: 'Round Trip', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1669' },
    { name: 'Monsters', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1194' },
  ],
  dp: [
    { name: 'Dice Combinations', difficulty: 'Easy', url: 'https://cses.fi/problemset/task/1633' },
    { name: 'Minimizing Coins', difficulty: 'Easy', url: 'https://cses.fi/problemset/task/1634' },
    { name: 'Coin Combinations I', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1635' },
    { name: 'Coin Combinations II', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1636' },
    { name: 'Removing Digits', difficulty: 'Easy', url: 'https://cses.fi/problemset/task/1637' },
    { name: 'Grid Paths', difficulty: 'Easy', url: 'https://cses.fi/problemset/task/1638' },
    { name: 'Book Shop', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1158' },
    { name: 'Array Description', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1746' },
    { name: 'Edit Distance', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1639' },
    { name: 'Rectangle Cutting', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1744' },
  ],
  tree: [
    { name: 'Subordinates', difficulty: 'Easy', url: 'https://cses.fi/problemset/task/1674' },
    { name: 'Tree Matching', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1130' },
    { name: 'Tree Diameter', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1131' },
    { name: 'Tree Distances I', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1132' },
    { name: 'Tree Distances II', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1133' },
    { name: 'Company Queries I', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1687' },
    { name: 'Company Queries II', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1688' },
  ],
  math: [
    { name: 'Exponentiation', difficulty: 'Easy', url: 'https://cses.fi/problemset/task/1095' },
    { name: 'Exponentiation II', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1712' },
    { name: 'Counting Divisors', difficulty: 'Easy', url: 'https://cses.fi/problemset/task/1713' },
    { name: 'Common Divisors', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1081' },
    { name: 'Sum of Divisors', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1082' },
    { name: 'Binomial Coefficients', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1079' },
    { name: 'Creating Strings II', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1715' },
  ],
  string: [
    { name: 'String Matching', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1753' },
    { name: 'Finding Borders', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1732' },
    { name: 'Finding Periods', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1733' },
    { name: 'Minimal Rotation', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1110' },
    { name: 'Longest Palindrome', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1111' },
    { name: 'Required Substring', difficulty: 'Hard', url: 'https://cses.fi/problemset/task/1112' },
  ],
  range: [
    { name: 'Static Range Sum Queries', difficulty: 'Easy', url: 'https://cses.fi/problemset/task/1646' },
    { name: 'Static Range Minimum Queries', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1647' },
    { name: 'Dynamic Range Sum Queries', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1648' },
    { name: 'Dynamic Range Minimum Queries', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1649' },
    { name: 'Range Xor Queries', difficulty: 'Easy', url: 'https://cses.fi/problemset/task/1650' },
    { name: 'Range Update Queries', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1651' },
    { name: 'Forest Queries', difficulty: 'Medium', url: 'https://cses.fi/problemset/task/1652' },
  ],
};

export const data = new SlashCommandBuilder()
  .setName('cses')
  .setDescription('Get a random CSES algorithm problem')
  .addStringOption(option =>
    option
      .setName('category')
      .setDescription('Problem category')
      .setRequired(true)
      .addChoices(
        { name: 'Graph Algorithms', value: 'graph' },
        { name: 'Dynamic Programming', value: 'dp' },
        { name: 'Tree Algorithms', value: 'tree' },
        { name: 'Mathematics', value: 'math' },
        { name: 'String Algorithms', value: 'string' },
        { name: 'Range Queries', value: 'range' },
      )
  );

export async function execute(client: Client, interaction: ChatInputCommandInteraction) {
  const category = interaction.options.getString('category', true);
  const categoryProblems = problems[category];

  if (!categoryProblems || categoryProblems.length === 0) {
    return interaction.reply({
      content: '❌ No problems found for this category!',
      ephemeral: true
    });
  }

  const randomProblem = categoryProblems[Math.floor(Math.random() * categoryProblems.length)];

  const difficultyColors: Record<string, ColorResolvable> = {
    'Easy': '#57F287',
    'Medium': '#FEE75C',
    'Hard': '#ED4245'
  };

  const categoryNames: Record<string, string> = {
    'graph': 'Graph Algorithms',
    'dp': 'Dynamic Programming',
    'tree': 'Tree Algorithms',
    'math': 'Mathematics',
    'string': 'String Algorithms',
    'range': 'Range Queries'
  };

  const embed = new EmbedBuilder()
    .setColor(difficultyColors[randomProblem.difficulty] || '#5865F2')
    .setTitle(`📚 ${randomProblem.name}`)
    .setURL(randomProblem.url)
    .setDescription('Click the title to view the problem on CSES')
    .addFields(
      { name: '📂 Category', value: categoryNames[category], inline: true },
      { name: '⚡ Difficulty', value: randomProblem.difficulty, inline: true }
    )
    .setFooter({ 
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL()
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}