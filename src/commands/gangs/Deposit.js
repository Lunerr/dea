const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Deposit extends patron.Command {
  constructor() {
    super({
      names: ['deposit'],
      groupName: 'gangs',
      description: 'Deposit into a gangs wealth.',
      preconditions: ['ingang'],
      args: [
        new patron.Argument({
          name: 'amount',
          key: 'transfer',
          type: 'cash',
          example: '500',
          preconditionOptions: [{ minimum: Constants.config.transfer.min }],
          preconditions: ['minimumcash', 'cash']
        })
      ]
    });
  }

  async run(msg, args) {
    const transactionFee = args.transfer * Constants.config.transfer.cut;
    const received = args.transfer - transactionFee;
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    const leader = await msg.guild.members.fetch(gang.leaderId);

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.transfer);
    await msg.client.db.gangRepo.updateGang(gang.leaderId, gang.guildId, new msg.client.db.updates.IncMoney('wealth', received));

    const newGang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    await leader.tryDM(msg.author.tag.boldify() + ' has deposited ' + received.USD() + ' to your gang.', { guild: msg.guild });

    return msg.createReply('you have successfully deposited ' + received.USD() + ' to your gang. Transaction fee: ' + transactionFee.USD() + '. Wealth: ' + NumberUtil.format(newGang.wealth) + '.');
  }
}

module.exports = new Deposit();
