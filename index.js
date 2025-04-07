const Discord = require("discord.js")
const { Client } = require("discord.js")
const Client = new Client({ intents: 53608447 })

Client.on("ready", () => {
    console.log(`Encendido como: ${client.user.tag}`)
});

Client.login("MTM1ODc3ODUxMzM4NTE5MzUzMg.GLo2U6.iwsFnxFdg-onh4aKO50t-36LdkfoRJ2d6_-A1M")