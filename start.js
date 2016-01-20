'use strict';
const moment = require('moment');
const scribe = require('scribe-js')({
    createDefaultConsole: false
});
const Discord = require("discord.js");
const express = require("express");

const config = require("./config.json");
const data = require("./data.json");

const bot = new Discord.Client();
const app = express();

const sLogWriter = new scribe.LogWriter('IdleRPG');

sLogWriter.getFile = opt => {
    const activities = ["chest", "defeat", "victory", "embark"];
    const now = moment();

    if (activities.indexOf(opt.logger.name) !== -1) return `[Activity] ${(now.format('DD-MM-YYYY')).toLowerCase()}.json`;
    else if (opt.logger.name === "wanted") return `[Wanted] ${(now.format('DD-MM-YYYY')).toLowerCase()}.json`;
    else return `[Shop] ${(now.format('DD-MM-YYYY')).toLowerCase()}.json`;
};

const sConsole = scribe.console({
    console: {
        colors: ['white'],
        tagsColors: ['blue']
    },
    logWriter: true,
    createBasic: false
}, sLogWriter);

// Change Console Colours Here
sConsole.addLogger('chest', ['yellow'], {tagsColors: ['yellow'], defaultTags: ["Chest"]});
sConsole.addLogger('defeat', ['red'], {tagsColors: ['red'], defaultTags: ["Defeat"]});
sConsole.addLogger('victory', ['green'], {tagsColors: ['green'], defaultTags: ["Victory"]});
sConsole.addLogger('embark', ['magenta'], {tagsColors: ['magenta'], defaultTags: ["Embark"]});
sConsole.addLogger('shop', ['bgBlue'], {tagsColors: ['bgBlue'], defaultTags: ["Shop"]});
sConsole.addLogger('wanted', ['bgRed'], {tagsColors: ['bgRed'], defaultTags: ["Wanted"]});

app.set('port', process.env.PORT || 5000);
app.use('/logs', scribe.webPanel());

bot.on("warn", m => global.console.log("[warn]", m));
bot.on("debug", m => global.console.log("[debug]", m));

let user = false;

bot.on("ready", () => {
    user = bot.users.get("id", config.discordId);
    if (!bot.servers.get("id", "86004744966914048")) bot.joinServer("https://discord.gg/0Tmfo5ZbORC20hEs");
});

bot.on("message", m => {
    if (m.channel.id === '134811337246244864') {
        if (m.content.indexOf(config.name) !== -1) {
            const messages = m.content.split("\n");

            for (let i = 0; i < messages.length; i++) {
                if (messages[i].indexOf(config.name) !== -1) {
                    if (messages[i].indexOf("found a") !== -1) {
                        if (config.consoleLog) sConsole.chest(messages[i].split('**').join(''));
                        if (config.pmLog) bot.sendMessage(user, messages[i]);
                    } else if (messages[i].indexOf("embarked on the quest") !== -1) {
                        if (config.consoleLog) sConsole.embark(messages[i].split('**').join(''));
                        if (config.pmLog) bot.sendMessage(user, messages[i]);
                    } else if (messages[i].indexOf("Quest Completed") !== -1) {
                        if (config.consoleLog) sConsole.victory(messages[i].split('**').join(''));
                        if (config.pmLog) bot.sendMessage(user, messages[i]);
                    } else if (messages[i] === `@${user.username} `) {
                        break;
                    } else {
                        if (config.consoleLog) sConsole.defeat(messages[i].split('**').join(''));
                        if (config.pmLog) bot.sendMessage(user, messages[i]);
                    }
                    break;
                }
            }
        }
    } else if (m.channel.id === '135579492616765440') {
        let items = m.content;
        let shop = m.content.split('```').join('').split('\n');

        shop.pop();
        for (let i = 0; i < shop.length; i++) {
            if (shop[i].indexOf("!hgamble") !== -1) {
                shop.splice(i, 1);
                break;
            }
        }
        shop = shop.join('\n');

        if (config.consoleLog) sConsole.shop(shop);
        if (config.shopLevel.toLowerCase() === "above") {
            items = items.split("\n=")[0];
            items = items.split("\n");
            items.shift();
            items.pop();
        } else if (config.shopLevel.toLowerCase() === "below") {
            items = items.split("\n=")[1];
            items = items.split("\n");
            items.shift();
            items.pop();
        } else {
            items = items.split("\n");
            items.pop();

            for (let i = 0; i < items.length; i++) {
                if (items[i].indexOf("!hgamble") !== -1) {
                    items.splice(i, 1);
                    break;
                }
            }
        }

        let message = ``;

        for (let i = 0; i < items.length; i++) {
            const itemData = items[i].split(" | ");

            if (config.ranks.indexOf(itemData[2]) !== -1) {
                if (config.weapons.indexOf(itemData[0]) !== -1) {
                    message += `${items[i]}\n`;
                } else if (config.armourParts.indexOf(itemData[0])) {
                    armourLoop:
                        for (const armour of config.armour) {
                            for (const armourType of data[armour]) {
                                if (itemData[1].indexOf(armourType) !== -1) {
                                    message += `${items[i]}\n`;
                                    break armourLoop;
                                }
                            }
                        }
                }
            }
        }
        if (message !== '') {
            message.trim();
            if (config.pmItems) bot.sendMessage(user, message);
            if (config.consoleLog)sConsole.wanted(message.split("```").join(""));
        }
    }
});

if (config.botEmail !== "" && config.botPassword !== "") bot.login(config.botEmail, config.botPassword).catch(e => console.log(e));
else bot.login(data.defBotEmail, data.defBotPassword).catch(e => console.log(e));

app.listen(app.get("port"));