const Constants = require('../../utility/Constants.js');
const patron = require('patron.js');

class ItemLb extends patron.Command {
  constructor() {
    super({
      names: ['itemleaderboards', 'itemlb', 'itemleaderboard'],
      groupName: 'general',
      description: 'View the most armed people.'
    });
  }

  async run(msg) {
    const getUsers = await msg.client.db.userRepo.findMany({ guildId: msg.guild.id });
    const users = getUsers.filter(x => Object.values(x.inventory).length > 0);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    users.sort((a, b) => Object.values(b.inventory).reduce(reducer) - Object.values(a.inventory).reduce(reducer));

    let message = '';

    for (let i = 0; i < users.length; i++) {
      if (i + 1 > Constants.config.misc.leaderboardCap) {
        break;
      }

      const user = await msg.client.users.fetch(users[i].userId);

      if (!user) {
        continue;
      }

      message += i + 1 + '. ' + user.tag.boldify() + ': ' + Object.values(users[i].inventory).reduce(reducer) + '\n';
    }

    if (String.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is nobody on the leaderboards.');
    }

    return msg.channel.createMessage(message, { title: 'The Item Leaderboards' });
  }
}

module.exports = new ItemLb();
