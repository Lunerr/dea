const patron = require('patron.js');

class Answers extends patron.Command {
  constructor() {
    super({
      names: ['answers'],
      groupName: 'moderation',
      description: 'See what the trivia answers are.'
    });
  }

  async run(msg) {
    let description = '';
    let position = 1;

    for (const key in msg.dbGuild.trivia) {
      description += position++ + '. ' + key.boldify() + ': ' + msg.dbGuild.trivia[key] + '\n';

      if (description.length > 1024) {
        await msg.author.tryDM(description, { title: 'Trivia Questions' });

        description = '';
      }
    }

    await msg.author.tryDM(description, { title: 'Trivia Answers' });

    return msg.createReply('you\'ve been DM\'d with all trivia questions.');
  }
}

module.exports = new Answers();
