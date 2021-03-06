'use strict';
const moment = require('moment');
const scribe = require('scribe-js')({
    createDefaultConsole: false
});
const Discord = require("discord.js");
const express = require("express");

const config = require("./config.json");
const offhandData = require("./offhandData.json");
const armourData = require("./armourData.json");
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
    if (!bot.servers.get("id", "140849390079180800")) bot.joinServer("https://discord.gg/0mmHjdSpb1IShqJE");
});

bot.on("message", m => {
    if (m.author.id === "140879741765812224") {
        if (m.channel.id === '140854986551590912') {
            if (m.content.indexOf(config.name) !== -1) {
                const messages = m.content.split("\n");

                for (let i = 0; i < messages.length; i++) {
                    if (messages[i].indexOf(config.name) !== -1) {
                        if (messages[i].indexOf("found a") !== -1 && messages[i].indexOf("MIMIC") === -1) {
                            if (config.consoleLog) sConsole.chest(messages[i].split('**').join(''));
                            if (config.pmLog) bot.sendMessage(user, messages[i]);
                        } else if (messages[i].indexOf("embarked on the quest") !== -1) {
                            if (config.consoleLog) sConsole.embark(messages[i].split('**').join(''));
                            if (config.pmLog) bot.sendMessage(user, messages[i]);
                        } else if (messages[i].indexOf(`${config.name}[`) !== -1) {
                            if (config.consoleLog) sConsole.victory(messages[i].split('**').join(''));
                            if (config.pmLog) bot.sendMessage(user, messages[i]);
                        } else if (messages[i].indexOf(`@${user.username} `) !== -1) {
                            break;
                        } else {
                            if (config.consoleLog) sConsole.defeat(messages[i].split('**').join(''));
                            if (config.pmLog) bot.sendMessage(user, messages[i]);
                        }
                        break;
                    }
                }
            }
        } else if (m.channel.id === '140853028960862208' || m.channel.id === '140853076994031616') {
            if (m.channel.id === '140853028960862208' && config.shopLevel.toLowerCase() === 'below') return;
            if (m.channel.id === '140853076994031616' && config.shopLevel.toLowerCase() === 'above') return;
            let shop = m.content;

            shop = shop.split("\n");
            shop.pop();
            shop = shop.join("\n").split("```").join("").split("\n");
            let message = [];

            for (let i = 0; i < shop.length; i++) {
                const itemData = shop[i].split(" | ");
                const tags = [];
                const ranks = ["+Ω", "+SSS", "+SS", "+S", "+A", "+B", "+C", "+D", "+E", "+F", "Ω", "SSS", "SS", "S", "A", "B", "C", "D", "E", "F"];
                const armourParts = ["Head", "Shoulders", "Arms", "Hands", "Chest", "Legs", "Feet"];
                const weapons = ["Axe", "Bow", "Crossbow", "Dagger", "Mace", "Polearm", "Spear", "Staff", "Sword", "Wand"];
                const potions = ["Health", "Strength", "Vitality", "Endurance", "Dexterity", "Luck", "Charisma", "Transmutation", "Intelligence"];
                const scrolls = ["Identify"];

                let index = ranks.indexOf(itemData[2]);

                if (index > -1) tags.push(ranks[index]);

                index = weapons.indexOf(itemData[0]);

                if (index > -1) {
                    tags.push("Weapon");
                    tags.push(weapons[index]);
                }

                if (tags.indexOf("Weapon") === -1) {
                    if (itemData[0] === "Offhand") {
                        tags.push("Offhand");
                        if (itemData[1].indexOf("Shield") > -1) {
                            if (itemData[1].indexOf("Small Shield") > -1) {
                                tags.push("Small Shield");
                            } else if (itemData[1].indexOf("Tower Shield") > -1) {
                                if (itemData[1].indexOf("Great Tower Shield") > -1) tags.push("Great Tower Shield");
                                else tags.push("Tower Shield");
                            } else {
                                tags.push("Shield");
                            }
                        }
                        offhandLoop:
                            for (const offhands in offhandData.unique) {
                                if (offhandData.unique.hasOwnProperty(offhands)) {
                                    for (const offhand of offhandData.unique[offhands]) {
                                        if (itemData[1].indexOf(offhand) > -1) {
                                            tags.push(offhands);
                                            break offhandLoop;
                                        }
                                    }
                                }
                            }
                    }

                    if (itemData[1].indexOf("Potion") > -1) {
                        for (const pot of potions) {
                            index = itemData[1].indexOf(pot);
                            if (index > -1) {
                                tags.push(pot);
                                break;
                            }
                        }
                    }

                    if (tags.indexOf("Offhand") === -1) {
                        if (itemData[0] === "Consumable") {
                            tags.push("Consumable");

                            if (itemData[1].indexOf("Potion") > -1) {
                                for (const pot of potions) {
                                    index = itemData[1].indexOf(pot);
                                    if (index > -1) {
                                        tags.push(pot);
                                        break;
                                    }
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

                        if (tags.indexOf("Consumable") === -1) {
                            armourLoop:
                                for (const armourType in armourData) {
                                    if (armourData.hasOwnProperty(armourType)) {
                                        for (const armour of armourData[armourType]) {
                                            if (itemData[1].indexOf(armour) > -1) {
                                                tags.push("Armour");
                                                tags.push(armourType);
                                                break armourLoop;
                                            }
                                        }
                                    }
                                }

                            index = armourParts.indexOf(itemData[0]);

                            if (index > -1) tags.push(armourParts[index]);
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
                    if (tags.indexOf(conWeapon) > -1 && tags.indexOf("Weapon")) {
                        weapon = true;
                        break;
                    }
                }

                for (const conOffhand of config.offhands) {
                    if (tags.indexOf(conOffhand) > -1 && tags.indexOf("Offhand")) {
                        offhand = true;
                        break;
                    }
                }

                for (const conPotion of config.potions) {
                    if (tags.indexOf(conPotion) > -1 && tags.indexOf("Consumable")) {
                        potion = true;
                        break;
                    }
                }

                for (const conScroll of config.scrolls) {
                    if (tags.indexOf(conScroll) > -1 && tags.indexOf("Consumable")) {
                        scroll = true;
                        break;
                    }
                }

                if (!weapon && !potion && !scroll && !offhand) {
                    for (const conArmPart of config.armourParts) {
                        if (tags.indexOf(conArmPart) > -1 && tags.indexOf("Armour")) {
                            armourPart = true;
                            break;
                        }
                    }

                    for (const conArmour of config.armour) {
                        if (tags.indexOf(conArmour) > -1 && tags.indexOf("Armour")) {
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
    }
});

if (config.botEmail !== "" && config.botPassword !== "") bot.login(config.botEmail, config.botPassword).catch(e => console.log(e));
else bot.login(defBot.defBotEmail, defBot.defBotPassword).catch(e => console.log(e));

app.listen(app.get("port"));