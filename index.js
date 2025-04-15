const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: ['CHANNEL'] 
});

client.slashCommands = new Collection();

let game = {
    created: false,
    maxPlayers: 0,
    players: [], 
    roles: {}
};

const mafiaCommand = {
    data: new SlashCommandBuilder()
        .setName('mafia')
        .setDescription('Comando para jugar Mafia')
        .addSubcommand(sub =>
            sub.setName('crear')
                .setDescription('Crea una nueva partida')
                .addIntegerOption(opt =>
                    opt.setName('cantidad')
                        .setDescription('Cantidad de jugadores')
                        .setRequired(true)
                        .setMinValue(4)
                )
        )
        .addSubcommand(sub =>
            sub.setName('unirme')
                .setDescription('Únete a la partida')
        )
        .toJSON(),

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'crear') {
            const cantidad = interaction.options.getInteger('cantidad');

            if (game.created) {
                return interaction.reply('❌ Ya hay una partida en curso.');
            }

            game.created = true;
            game.maxPlayers = cantidad;
            game.players = [];
            game.roles = {};

            return interaction.reply(`🎭 Se ha creado una partida de Mafia para **${cantidad} jugadores**. Usa \`/mafia unirme\` para participar.`);
        }

        if (subcommand === 'unirme') {
            if (!game.created) {
                return interaction.reply('❌ No hay partida creada. Usa `/mafia crear <cantidad>`.');
            }

            const userId = interaction.user.id;
            const username = interaction.user.username;

            if (game.players.find(p => p.id === userId)) {
                return interaction.reply('⚠️ Ya estás en la partida.');
            }

            if (game.players.length >= game.maxPlayers) {
                return interaction.reply('⚠️ La partida ya está llena.');
            }

            game.players.push({ id: userId, username });

            await interaction.reply(`✅ **${username}** se ha unido a la partida. Jugadores: ${game.players.length}/${game.maxPlayers}`);

            if (game.players.length === game.maxPlayers) {
                assignRoles();
                notifyPlayers(client);
                game.created = false; 
            }
        }
    }
};

client.slashCommands.set('mafia', mafiaCommand);

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return;

    try {
        // ✅ Solo ejecuta si tiene subcomandos
        if (interaction.options._subcommand) {
            await cmd.execute(client, interaction);
        } else {
            await interaction.reply("⚠️ Debes usar un subcomando. Ej: `/mafia crear` o `/mafia unirme`");
        }
    } catch (err) {
        console.error("❌ Error al ejecutar el comando:", err);
        interaction.reply("❌ Ocurrió un error al ejecutar el comando.");
    }
});

client.once("ready", () => {
    console.log(`[ ⚡ ] Bot encendido como ${client.user.tag}`);
});

(async () => {
    try {
        await client.login(process.env.TOKEN);
    } catch (err) {
        console.error(`[ ❌ ] Error al iniciar el bot => ${err}`);
    }
})();

function assignRoles() {
    const shuffled = [...game.players].sort(() => Math.random() - 0.5);

    game.roles[shuffled[0].id] = "Mafioso";
    game.roles[shuffled[1].id] = "Detective";
    game.roles[shuffled[2].id] = "Doctor";

    for (let i = 3; i < shuffled.length; i++) {
        game.roles[shuffled[i].id] = "Ciudadano";
    }
}

async function notifyPlayers(client) {
    for (const player of game.players) {
        const user = await client.users.fetch(player.id);
        const rol = game.roles[player.id];

        try {
            await user.send(`🤫 Tu rol es **${rol}**.\nSigue las instrucciones del bot para jugar.`);
        } catch (err) {
            console.warn(`No se pudo enviar DM a ${player.username}`);
        }
    }
}
