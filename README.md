# Log and Notifier Bot for IdleRPG

A Discord Bot that logs your IdleRPG Activity and notifies you on items in the shop based on the set configurations.

## Requires
- [Node.js](https://nodejs.org/en/) (>v5.0.0)

## Installation

1. Download the repository with git clone or some other method to a directory.
2. Open a command prompt/terminal at the directory.
3. Run `npm install`
4. Set the configuration in the *config.json* file.
5. Run `node start`

## Configuration

- name: The name of your RPG Character. [String]
- discordId: Your Discord Account ID. (For PM Notifications) [String]
- botEmail: The email of the account the bot will use. (Will use default bot if left blank) [String] 
- botPassword: The password of the account the bot will use. (Will use default bot if left blank) [String] 
- ranks: List of the ranks you want to be notified for from the shop. [Array of String]
- weapons: List of Weapon Types you want to be notified for from the shop. [Array of String]
- armourParts: List of Armour Parts you want to be notified for from the shop. [Array of String]
- armour: List of Armour Types you want to be notified for from the shop. [Array of String]
- potions: List of Potions you want to be notified for from the shop. (Ignores Rank Config) [Array of String]
- shopLevel: Select which shop to check (Lvl <100, Lvl 100, or both). Use `below`, `above`, or `all`. [String]
- pmLog: If true, the bot will PM you your activities (Chest, Quest, etc). [Boolean]
- pmItems: If true, the bot will PM items in the shop that match the configured criteria. [Boolean]
- consoleLog: If true, the bot will log activities, shop, and wanted items on console and website. [Boolean]

## Notes (READ THIS)

- **You can use the same email and password for the account that matches the discordId, however PMs will not work if you do so.**
- The website will be available at `localhost:5000`, unless you change the port of course.
- **There are 3 log files (Activity, Shop, Wanted). At the top left of the website, there's a menu button which lets you select which log files to show. You'll likely be looking to have Activity selected. The website selects the first log file created by default so it will either show the Shop or Activity log file.**
- To filter by tags on the website, enclose your search tag in []. `e.g. [+B][Sword]`
- You will need to restart the bot when updating configurations.
- To use console only, just remove any `express` related code.
- Colouring in console can be changed, just change the related code to so. See [here](https://github.com/bluejamesbond/Scribe.js/wiki/4-%C2%B7-API-%3A-Console2) for more info on how to change console colours.
- Bot will auto-join the BDA server if not connected.
- If you get a "Failed to locate: CL.exe" error during npm install, you will need to either install Visual Studio or the Windows SDK for your OS [[7](https://www.microsoft.com/en-au/download/details.aspx?id=8279), [8](https://msdn.microsoft.com/en-us/windows/desktop/hh852363.aspx), [8.1](https://msdn.microsoft.com/en-us/windows/desktop/bg162891.aspx), [10](https://dev.windows.com/en-us/downloads/windows-10-sdk)]
