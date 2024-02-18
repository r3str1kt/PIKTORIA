const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const nameToImdb = require('name-to-imdb');
const fs = require('fs').promises; // Import the file system module

const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const commands = [
  new SlashCommandBuilder()
    .setName('search')
    .setDescription('Searches the movie you want')
    .addStringOption(option =>
      option
        .setName('input')
        .setDescription('Name of the movie you want to fetch')
        .setRequired(true)
    ),
];

const clientId = '1195090113642889378';
const token = config.token; // Assuming your config file has a field named 'token'
const rest = new REST({ version: '9' }).setToken(token);

// Create an empty array to store search inputs
let searchInputs = [];

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands.map(command => command.toJSON()) },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on('ready', () => {
  sv = client.guilds.cache.size 
  console.log(`Logged in as ${client.user.tag}`);
  const activities = [
    `on ${sv} servers.`,
    '/search to find movies playable link!',
    `to find movies on ${sv} servers.`,
    
  ];
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * activities.length);
    const newActivity = activities[randomIndex];
    client.user.setActivity(newActivity);  
  }, 8_000);
});

link1 = "https://databasegdriveplayer.xyz/player.php?imdb="
link2 = "https://2embed.me/movie/"
link3 = "https://vidsrc.me/embed/"
link4 = "https://embed.smashystream.com/playere.php?imdb="

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName, options } = interaction;
  
  if (commandName === 'search') {
    const input = options.getString('input');
    nameToImdb(input, async function(err, res, inf) {
      id1 = link1 + res
      id2 = link2 + res
      id3 = link3 + res
      id4 = link4 + res
      im = inf.meta.image.src
      const movemd = new EmbedBuilder()
        .setColor('Random')
        .setThumbnail(`${im}`)
        .setTitle(`${inf.meta.name} [${inf.meta.year}]` + `\n${id1} ` + `\n${id2} ` + `\n${id3} ` + `\n${id4} `)
        .setAuthor({ name: 'Welcome to Piktoria! The Movie Bot! \nHere is the link for the requested movie', url: 'https://discord.com/api/oauth2/authorize?client_id=1107183597229715457&permissions=8&scope=bot' })
        .setDescription('Always use a browser with ad blocker, like, brave browser(tested) works 100%')
        .setTimestamp()
        .setFooter({ text: '/search', iconURL: 'https://media.discordapp.net/attachments/1107199745186873384/1107199797523394642/1.png?width=662&height=662' });

      // Store the search input in the array
      searchInputs.push({ user: interaction.user.tag, command: commandName, input });

      // Save the array to a JSON file
      await saveSearchInputs();

      // Send the command and input to a specific channel
      const logChannelId = 'channel-id'; // Replace with the actual channel ID
      const logChannel = interaction.guild.channels.cache.get(logChannelId);

      if (logChannel) {
        const logMessage = `User ${interaction.user.tag} used command '/${commandName}' with input '${input}'`;
        logChannel.send({ content: logMessage, embeds: [movemd] }).catch(console.error); // Ensure you catch any potential errors
      } else {
        console.error(`Log channel with ID ${logChannelId} not found.`);
      }

      // No need to acknowledge again, interaction.reply automatically acknowledges
      interaction.reply({ embeds: [movemd] }).catch(console.error);
    });
  }
});

client.login(token);

// Function to save searchInputs array to a JSON file
async function saveSearchInputs() {
  try {
    const jsonContent = JSON.stringify(searchInputs, null, 2);
    await fs.writeFile('searchInputs.json', jsonContent);
    console.log('Search inputs saved to searchInputs.json');
  } catch (error) {
    console.error('Error saving search inputs:', error);
  }
}