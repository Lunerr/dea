const Constants = require('../../utility/Constants.js');
const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Leaderboards extends patron.Command {
  constructor() {
    super({
      names: ['leaderboards', 'lb', 'highscores', 'highscore', 'leaderboard'],
      groupName: 'general',
      description: 'View the richest Drug Traffickers.'
    });
  }

  async run(msg) {
    const users = await msg.client.db.userRepo.findMany({ guildId: msg.guild.id });

    users.sort((a, b) => b.cash - a.cash);

    let message = '';

    for (let i = 0; i < users.length; i++) {
      if (i + 1 > Constants.config.misc.leaderboardCap) {
        break;
      }

      const user = await msg.client.users.fetch(users[i].userId);

      if (!user) {
        continue;
      }

      message += i + 1 + '. ' + user.tag.boldify() + ': ' + NumberUtil.format(users[i].cash) + '\n';
    }

    if (String.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is nobody on the leaderboards.');
    }

    return msg.channel.createMessage(message, { title: 'The Richest Traffickers' });
  }
}

module.exports = new Leaderboards();
