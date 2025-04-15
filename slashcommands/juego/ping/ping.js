const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "¡Comando de ping!",

    async execute(client, message, args) {
        const ping = Date.now() - message.createdTimestamp;

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`📡 Ping => ${ping}ms`);

        message.reply({ embeds: [embed] });
    }
};
