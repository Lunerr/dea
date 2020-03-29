const patron = require('patron.js');

class UpdateUser extends patron.Command {
  constructor() {
    super({
      names: ['updateuser'],
      groupName: 'botowners',
      description: 'Update any user in the RealiLife database.',
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: '290823959669374987'
        }),
        new patron.Argument({
          name: 'guild',
          key: 'guild',
          type: 'guild',
          example: '290759415362224139'
        }),
        new patron.Argument({
          name: 'update',
          key: 'update',
          type: 'string',
          example: '{ $inc: { cash: 5000 } }',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.userRepo.updateUser(args.user.id, args.guild.id, eval('(' + args.update + ')'));

    return msg.createReply('you have updated the user ' + args.user.id + '.');
  }
}

module.exports = new UpdateUser();
