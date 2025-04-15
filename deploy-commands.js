// deploy-commands.js
const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('mafia')
        .setDescription('Comando para jugar Mafia')
        .addSubcommand(sub =>
            sub.setName('crear')
                .setDescription('Crea una partida')
                .addIntegerOption(opt =>
                    opt.setName('cantidad')
                        .setDescription('Cantidad de jugadores')
                        .setRequired(true)
                        .setMinValue(4)
                )
        )
        .addSubcommand(sub =>
            sub.setName('unirme')
                .setDescription('Únete a una partida existente')
        )
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Reemplaza estos con tus propios IDs
const CLIENT_ID = 'TU_CLIENT_ID';
const GUILD_ID = 'TU_GUILD_ID'; // opcional para pruebas en un servidor específico

(async () => {
    try {
        console.log('⏳ Registrando comandos...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), // Usa Routes.applicationCommands(CLIENT_ID) si es global
            { body: commands }
        );
        console.log('✅ Comandos registrados con éxito.');
    } catch (err) {
        console.error('❌ Error al registrar comandos:', err);
    }
})();
