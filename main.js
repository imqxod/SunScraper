const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const gradient = require('gradient-string');
const prompt = require("prompt-sync")({ sigint: true });

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

function getTokenFromConfig() {
    try {
        const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
        return config.token;
    } catch (error) {
        console.error(red("[-] Error while parsing config.json"));
        return null;
    }
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const client = new Client();

client.on('ready', async () => {
    console.log(gradient.pastel(logo))
    console.log(gradient.pastel(`[+] logged in as ${client.user.username}`));
    const guildId = prompt(gradient.pastel("[?] enter server id: "));

    const guild = client.guilds.resolve(guildId);
    if (!guild) {
        console.error(red('[-] guild not found'));
        return;
    }

    try {
        const members = await guild.members.fetch();
        const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
        const filteredUserIds = config.filteredUserIds || [];
        const memberIds = members
            .filter(member => !filteredUserIds.includes(member.user.id))
            .map(member => member.user.id);

        const fileName = `scraped_${guild.name.trim()}_${makeid(5)}.txt`;
        fs.writeFile(fileName, memberIds.join('\n'), err => {
            if (err) {
                console.error(red(`[-] error while saving ids to file ${fileName}`));
            } else {
                console.log(green(`[+] saved ids to ${fileName}`));
            }
        });
    } catch (error) {
        console.error(red('[-] error while getting members'));
    }
});

const token = getTokenFromConfig();
if (token) {
    client.login(token);
} else {
    console.error(red("[-] token not found"));
}
