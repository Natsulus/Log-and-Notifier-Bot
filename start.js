'use strict';
const moment = require('moment');
const scribe = require('scribe-js')({
    createDefaultConsole: false
});
const Discord = require("discord.js");
const express = require("express");

const config = require("./config.json");
const data = require("./data.json");
const defBot = require("./defBot.json");

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
sConsole.addLogger('shop', ['bgBlue'], {tagsColors: ['bgBlue']});
sConsole.addLogger('wanted', ['bgRed'], {tagsColors: ['bgRed'], defaultTags: ["Wanted"]});

app.set('port', process.env.PORT || 5000);
app.use('/', scribe.webPanel());

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
                    } else if (messages[i].indexOf("Gold!]") !== -1) {
                        if (config.consoleLog) sConsole.victory(messages[i].split('**').join(''));
                        bot.sendMessage(user, messages[i]);
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
        let shop = m.content;

        if (config.shopLevel.toLowerCase() === "above") {
            shop = shop.split("\n=")[0];
            shop = shop.split("\n");
            shop.shift();
            shop.pop();
        } else if (config.shopLevel.toLowerCase() === "below") {
            shop = shop.split("\n=")[1];
            shop = shop.split("\n");
            shop.shift();
            shop.pop();
        } else {
            shop = shop.split("\n");
            shop.pop();

            for (let i = 0; i < shop.length; i++) {
                if (shop[i].indexOf("!hgamble") !== -1) {
                    shop.splice(i, 1);
                    break;
                }
            }
        }
        if (config.consoleLog) sConsole.shop("==========Separator==========");

        for (let i = 0; i < shop.length; i++) {
            if (shop[i].includes("====")) {
                shop.splice(i, 1);
                i--;
            }
        }
        shop = shop.join("\n");
        shop = shop.split("```").join("").split("\n");
        let message = [];

        for (let i = 0; i < shop.length; i++) {
            const itemData = shop[i].split(" | ");
            const tags = [];
            const ranks = ["+Ω", "+SSS", "+SS", "+S", "+A", "+B", "+C", "+D", "+E", "+F", "Ω", "SSS", "SS", "S", "A", "B", "C", "D", "E", "F"];
            const armourParts = ["Head", "Shoulders", "Arms", "Hands", "Chest", "Legs", "Feet"];
            const weapons = ["Axe", "Bow", "Crossbow", "Dagger", "Mace", "Polearm", "Spear", "Staff", "Sword", "Wand"];
            const offhands = ["Book", "Great Tower Shield", "Orb", "Quiver", "Shield", "Symbol", "Tower Shield", "Small Shield"];
            const potions = ["Health", "Strength", "Vitality", "Endurance", "Dexterity", "Luck", "Charisma", "Transmutation", "Intelligence"];
            const scrolls = ["Identify"];

            let index = ranks.indexOf(itemData[2]);

            if (index > -1) tags.push(ranks[index]);

            index = weapons.indexOf(itemData[0]);

            if (index > -1) {
                tags.push("Weapon");
                tags.push(weapons[index]);
            }

            index = offhands.indexOf(itemData[0]);

            if (index > -1) {
                tags.push("Offhand");
                tags.push(offhands[index]);
            }

            index = armourParts.indexOf(itemData[0]);

            if (index > -1) {
                tags.push("Armour");
                tags.push(armourParts[index]);
            }

            if (itemData[0] === "Consumable") {
                tags.push("Consumable");

                for (const pot of potions) {
                    index = itemData[1].indexOf(pot);
                    if (index > -1) {
                        tags.push(pot);
                        break;
                    }
                }

                if (itemData[1].indexOf("Sroll") > -1 || itemData[1].indexOf("Scroll") > -1) {
                    for (const scroll of scrolls) {
                        index = itemData[1].indexOf(scroll);
                        if (index > -1) {
                            tags.push(scroll);
                            break;
                        }
                    }
                }
            }

            armourLoop:
            for (const armourType in data) {
                if (data.hasOwnProperty(armourType)) {
                    for (const armour of data[armourType]) {
                        if (itemData[1].indexOf(armour) > -1) {
                            tags.push(armourType);
                            break armourLoop;
                        }
                    }
                }
            }
            if (config.consoleLog) sConsole.tag(...tags).shop(shop[i]);
            let armour = false,
                armourPart = false,
                offhand = false,
                potion = false,
                rank = false,
                scroll = false,
                weapon = false;

            for (const conRank of config.ranks) {
                if (tags.indexOf(conRank) > -1) {
                    rank = true;
                    break;
                }
            }

            for (const conWeapon of config.weapons) {
                if (tags.indexOf(conWeapon) > -1) {
                    weapon = true;
                    break;
                }
            }

            for (const conOffhand of config.weapons) {
                if (tags.indexOf(conOffhand) > -1) {
                    offhand = true;
                    break;
                }
            }

            for (const conPotion of config.potions) {
                if (tags.indexOf(conPotion) > -1) {
                    potion = true;
                    break;
                }
            }

            for (const conScroll of config.scrolls) {
                if (tags.indexOf(conScroll) > -1) {
                    scroll = true;
                    break;
                }
            }

            if (!weapon && !potion && !scroll && !offhand) {
                for (const conArmPart of config.armourParts) {
                    if (tags.indexOf(conArmPart) > -1) {
                        armourPart = true;
                        break;
                    }
                }

                for (const conArmour of config.armour) {
                    if (tags.indexOf(conArmour) > -1) {
                        armour = true;
                        break;
                    }
                }
            }

            if (scroll || potion || rank && (weapon || offhand || armourPart && armour)) {
                if (config.consoleLog) sConsole.tag(...tags).wanted(shop[i]);
                message.push(shop[i]);
            }
        }

        message = message.map(mes => `\`\`\`${mes}\`\`\``);

        if (message.length !== 0 && config.pmItems) bot.sendMessage(user, message.join("\n"));
    }
});

if (config.botEmail !== "" && config.botPassword !== "") bot.login(config.botEmail, config.botPassword).catch(e => console.log(e));
else bot.login(defBot.defBotEmail, defBot.defBotPassword).catch(e => console.log(e));

app.listen(app.get("port"));