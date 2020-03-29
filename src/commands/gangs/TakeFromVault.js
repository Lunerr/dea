const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class TakeFromVault extends patron.Command {
  constructor() {
    super({
      names: ['takefromvault', 'takevault', 'takeitem', 'takefromgang', 'withdrawitem', 'yoink'],
      groupName: 'gangs',
      description: 'Take an item from a gangs vault.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.gang.cooldownTakeFromVault,
      preconditions: ['ingang'],
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'intervention',
          preconditions: ['notinvault']
        }),
        new patron.Argument({
          name: 'amount',
          key: 'amount',
          type: 'int',
          example: '2',
          defaultValue: 1,
          preconditionOptions: [{ minimum: 1 }, { maximum: 5 }],
          preconditions: ['minimum', 'maximum', 'vaulthasamount'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const inv = 'inventory.' + args.item.names[0];
    const vault = 'vault.' + args.item.names[0];

    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [inv]: args.amount } });
    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $inc: { [vault]: -args.amount } });

    const leader = await msg.guild.members.fetch(gang.leaderId);

    await leader.tryDM(msg.author.tag.boldify() + ' has just taken ' + args.amount + ' of ' + (args.amount > 1 ? args.item.names[0] + 's' : args.item.names[0]) + ' from your gangs vault.', { guild: msg.guild });

    return msg.createReply('you have successfully taken ' + args.amount + ' of ' + (args.amount > 1 ? args.item.names[0] + 's' : args.item.names[0]) + ' from your gangs vault.');
  }
}

module.exports = new TakeFromVault();
