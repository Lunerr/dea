const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class AddRank extends patron.Command {
  constructor() {
    super({
      names: ['addrank', 'setrank', 'enablerank'],
      groupName: 'administration',
      description: 'Add a rank.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Sicario',
          preconditions: ['hierarchy']
        }),
        new patron.Argument({
          name: 'cashRequired',
          key: 'cashRequired',
          type: 'amount',
          example: '500'
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.dbGuild.roles.rank.some(role => role.id === args.role.id)) {
      return msg.createErrorReply('this rank role has already been set.');
    }

    const update = new msg.client.db.updates.Push('roles.rank', { id: args.role.id, cashRequired: NumberUtil.round(args.cashRequired, 2) });

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply('you have successfully added the rank role ' + args.role.toString() + ' with a cash required amount of ' + args.cashRequired.USD() + '.');
  }
}

module.exports = new AddRank();
