const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const gradient = require('gradient-string');
const prompt = require("prompt-sync")({ sigint: true });
const cfg = require('./config.json'); // Fixed path to config.json

const red = gradient('red', 'red');
const green = gradient('green', 'green');
const logo = `
 ____                 ____
/ ___|  _   _  _ __  / ___|   ___  _ __  __ _  _ __    ___  _ __
\\___ \\ | | | || '_ \\ \\___ \\  / __|| '__|/ _\` || '_ \\  / _ \\| '__|
 ___) || |_| || | | | ___) || (__ | |  | (_| || |_) ||  __/| |
|____/  \\__,_||_| |_|____/  \\___||_|   \\__,_|| .__/  \\___||_|
                                              |_|
`;

const client = new Client();

client.on('ready', async () => {
    console.log(gradient.pastel(logo));
    console.log(gradient.pastel(`[+] logged in as ${client.user.username}`));
    const guildId = prompt(gradient.pastel("[?] enter server id: "));

    try {
        const guild = await client.guilds.fetch(guildId); // Use fetch method
        if (!guild) {
            console.error(red('[-] guild not found'));
            return;
        }

        const members = await guild.members.fetch();
        const filteredUserIds = cfg.filteredUserIds || [];
        const memberIds = members
            .map(member => member.user.id);

        const fileName = `scraped.txt`;
        fs.writeFile(fileName, memberIds.join('\n'), err => {
            if (err) {
                console.error(red(`[-] error while saving ids to file ${fileName}`));
            } else {
                console.log(green(`[+] saved ids to ${fileName}`));
            }
        });
    } catch (error) {
        console.error(red('[-] error while getting members: ' + error.message));
    }
});


const token = cfg.token;
if (token) {
    client.login(token).catch(err => {
        console.error(red(`[-] login failed: ${err.message}`));
    });
} else {
    console.error(red("[-] token not found"));
}
