const patron = require('patron.js');

class RemoveTriviaQuestion extends patron.Command {
  constructor() {
    super({
      names: ['removetriviaquestion', 'removetrivia', 'removequestion'],
      groupName: 'administration',
      description: 'Remove a trivia question.',
      args: [
        new patron.Argument({
          name: 'question',
          key: 'question',
          type: 'string',
          example: 'is john gay',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const question = 'trivia.' + args.question;

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $unset: { [question]: '' } });

    return msg.createReply('you\'ve successfully removed question **' + args.question + '**.');
  }
}

module.exports = new RemoveTriviaQuestion();
