const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Poll extends patron.Command {
  constructor() {
    super({
      names: ['poll', 'findpoll'],
      groupName: 'polls',
      description: 'Finds a poll.',
      args: [
        new patron.Argument({
          name: 'poll',
          key: 'poll',
          type: 'poll',
          example: '4',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    let creator = '';
    let choices = '';
    let choiceNum = 1;
    const timeLeft = NumberUtil.msToTime(args.poll.length - (Date.now() - args.poll.createdAt));

    if (args.poll.creatorId && args.poll.creatorId) {
      const getCreator = await msg.client.users.fetch(args.poll.creatorId);

      creator = getCreator.tag;
    } else {
      creator = 'Nobody';
    }

    for (const key in args.poll.choices) {
      choices += choiceNum++ + '. ' + key + ': ' + args.poll.choices[key] + ',\n';
    }

    return msg.channel.createMessage('**Index:** ' + args.poll.index + '\n**Creator:** ' + creator + '\n**Answers:** \n' + choices.substring(0, choices.length - 2) + '\n**Ending:** ' + timeLeft.days + ' days, ' + timeLeft.hours + ' hours, ' + timeLeft.minutes + ' minutes, ' + timeLeft.seconds + ' seconds\n**Elder Only:** ' + (args.poll.elderOnly ? 'Yes' : 'No') + '\n**Mod Only:** ' + (args.poll.modOnly ? 'Yes' : 'No'), { title: args.poll.name });
  }
}

module.exports = new Poll();
