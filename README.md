# Log and Notifier Bot for IdleRPG

A Discord Bot that logs your IdleRPG Activity and notifies you on items in the shop based on the set configurations.

## Installation

1. Download the repository with git clone or some other method to a directory.
2. Open a command prompt/terminal at the directory.
3. Run `npm install`
4. Set the configuration in the *config.json* file.
5. Run `node start`

## Configuration

- name: The name of your RPG Character. [String]
- discordId: Your Discord Account ID. [String]
- botEmail: The email of the account the bot will use. [String]
- botPassword: The password of the account the bot will use. [String]
- ranks: List of the ranks you want to be notified for from the shop. [Array of String]
- weapons: List of Weapon Types you want to be notified for from the shop. [Array of String]
- armourParts: List of Armour Parts you want to be notified for from the shop. [Array of String]
- armour: List of Armour Types you want to be notified for from the shop. [Array of String]
- shopLevel: Select which shop to check (Lvl <100, Lvl 100, or both). Use `below`, `above`, or `all`. [String]

## Notes

- **You can use the same email and password for the account that matches the discordId, however notifications will not work if you do so.**
- The website will be available at `localhost:5000/logs`, unless you change the port of course.
- **There are 3 log files (Activity, Shop, Wanted). At the top left of the website, there's a menu button which lets you select which log files to show. You'll likely be looking to have Activity selected. The website selects the first log file created by default so it will either show the Shop or Activity log file.**
- You will need to restart the bot when updating configurations.
- To use console only, just remove any `express` related code.
- Colouring in console can be changed, just change the related code to so. See [here](https://github.com/bluejamesbond/Scribe.js/wiki/4-%C2%B7-API-%3A-Console2) for more info on how to change console colours.
- Bot will auto-join the BDA server if not connected.
