const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mafia') // Este debe ser un nombre válido para el comando
        .setDescription('Crea una partida de Mafia')
        .addSubcommand(subcommand =>
            subcommand
                .setName('crear')
                .setDescription('Crea una nueva partida de Mafia')
                .addIntegerOption(option =>
                    option.setName('cantidad')
                        .setDescription('Número de jugadores para la partida')
                        .setRequired(true)
                        .setMinValue(3)
                )
        ),

    async execute(interaction) {
        const cantidad = interaction.options.getInteger('cantidad');

        if (cantidad < 3) {
            return interaction.reply("⚠️ Especificá un número válido de jugadores (mínimo 3).");
        }

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('🎭 Partida de Mafia creada')
            .setDescription(`Se ha creado una partida para **${cantidad} jugadores**.\n¡Esperando que se unan!`);

        await interaction.reply({ embeds: [embed] });
    },
};
