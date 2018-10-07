const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class WithdrawPrec extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'withdrawprec'
    });
  }

  async run(command, msg, argument, args, value) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });
    const maxWithdraw = gang.leaderId == msg.author.id || gang.elders.includes(msg.author.id) ? 0.2 : 0.05;
    const maxVal = Math.round(NumberUtil.realValue(gang.wealth) * maxWithdraw, 2);

    if (value <= maxVal) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'You may only withdraw ' + maxWithdraw.toLocaleString('en', { style: 'percent' }) + ' of your gang\'s wealth, that is ' + maxVal.USD() + '.');
  }
}

module.exports = new WithdrawPrec();
