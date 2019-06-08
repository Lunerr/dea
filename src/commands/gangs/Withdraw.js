const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Withdraw extends patron.Command {
  constructor() {
    super({
      names: ['withdraw'],
      groupName: 'gangs',
      description: 'Withdraw money from your gang.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.gang.cooldownWithdraw,
      preconditions: ['ingang'],
      args: [
        new patron.Argument({
          name: 'amount',
          key: 'transfer',
          type: 'amount',
          example: '500',
          preconditionOptions: [{ minimum: Constants.config.gang.min }],
          preconditions: ['minimumcash', 'withdrawprec']
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    const leader = msg.guild.members.get(gang.leaderId);

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, args.transfer);
    await msg.client.db.gangRepo.updateGang(gang.leaderId, gang.guildId, new msg.client.db.updates.IncMoney('wealth', -args.transfer));

    const newGang = await msg.client.db.gangRepo.findOne({ guildId: msg.guild.id, name: gang.name });

    await leader.tryDM(msg.author.tag.boldify() + ' has withdrawn ' + args.transfer.USD() + ' from your gang.', { guild: msg.guild });

    return msg.createReply('you have successfully withdrawn ' + args.transfer.USD() + ' from your gang. ' + newGang.name + '\'s Wealth: ' + NumberUtil.format(newGang.wealth) + '.');
  }
}

module.exports = new Withdraw();
