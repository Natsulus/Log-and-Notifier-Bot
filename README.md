# Log and Notifier Bot for IdleRPG

A Discord Bot that logs your IdleRPG Activity and notifies you on items in the shop based on the set configurations.

## Requires
- [Node.js](https://nodejs.org/en/) (>v5.0.0)
- Python v2.7 (Not >v3.0)

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
- offhands: List of Offhand Types you want to be notified for from the shop. [Array of String]
- armourParts: List of Armour Parts you want to be notified for from the shop. [Array of String]
- armour: List of Armour Types you want to be notified for from the shop. [Array of String]
- potions: List of Potions you want to be notified for from the shop. (Ignores Rank Config) [Array of String]
- scrolls: List of Scrolls you want to be notifier for from the shop. (Ignores Rank Config) [Array of String]
- shopLevel: Select which shop to check and log (Lvl <100, Lvl 100, or both). Use `below`, `above`, or `all`. [String]
- pmLog: If true, the bot will PM you your activities (Chest, Quest, etc). [Boolean]
- pmItems: If true, the bot will PM items in the shop that match the configured criteria. [Boolean]
- consoleLog: If true, the bot will log activities, shop, and wanted items on console and website. [Boolean]

## Notes (READ THIS)

- **You will probably get 2 errors involving bufferutil and utf-8-validate when you run `npm install` if you don't have Visual Studio with C++ Components, HOWEVER, you can ignore these errors as they do not affect how the program is run.**
- **You can use the same email and password for the account that matches the discordId, however PMs will not work if you do so.**
- If you want PMs but are too lazy to set up your own bot account, leave the botEmail and botPassword as "" to use my bot account instead.
- The website will be available at `localhost:5000`, unless you change the port of course.
- **There are 3 log files (Activity, Shop, Wanted). At the top left of the website, there's a menu button which lets you select which log files to show. You'll likely be looking to have Activity selected. The website selects the first log file created by default so it will either show the Shop or Activity log file.**
- To filter by tags on the website, enclose your search tag in []. `e.g. [+B][Sword]`
- You will need to restart the bot when updating configurations.
- To use console only, just remove any `express` related code.
- Colouring in console can be changed, just change the related code to do so. See [here](https://github.com/bluejamesbond/Scribe.js/wiki/4-%C2%B7-API-%3A-Console2) for more info on how to change console colours.
- Colouring of website can also be changed, but you will need CSS knowledge. Just edit and add additional CSS to the *style.css* file at `DIRECTORY/node_modules/scribe-js/static`
- Bot will auto-join the IdleRPG server if not connected.
