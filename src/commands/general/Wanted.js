const Constants = require('../../utility/Constants.js');
const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Wanted extends patron.Command {
  constructor() {
    super({
      names: ['wanted', 'bounties', 'bl', 'bountyleaderboards'],
      groupName: 'general',
      description: 'View the most Targeted Drug Traffickers.'
    });
  }

  async run(msg) {
    const users = await msg.client.db.userRepo.findMany({ guildId: msg.guild.id });
    const sorted = users.filter(x => x.bounty).sort((a, b) => b.bounty - a.bounty);

    let message = '';

    for (let i = 0; i < sorted.length; i++) {
      if (i + 1 > Constants.config.misc.leaderboardCap) {
        break;
      }

      const user = await msg.client.users.fetch(sorted[i].userId);

      if (!user) {
        continue;
      }

      message += i + 1 + '. ' + user.tag.boldify() + ': ' + NumberUtil.format(sorted[i].bounty) + '\n';
    }

    if (String.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is nobody on the bounty leaderboards yet.');
    }

    return msg.channel.createMessage(message, { title: 'The Most Targeted Traffickers' });
  }
}

module.exports = new Wanted();
