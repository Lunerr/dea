const patron = require('patron.js');

class ModifyGangWealth extends patron.Command {
  constructor() {
    super({
      names: ['modifygangwealth', 'modifywealth', 'modwealth', 'modifygangcash', 'modgangcash', 'modgangwealth'],
      groupName: 'owners',
      description: 'Modifies the specified gang\'s wealth.',
      args: [
        new patron.Argument({
          name: 'amount',
          key: 'amount',
          type: 'amount',
          example: '1000'
        }),
        new patron.Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'best gang ever',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    let gang = args.gang;

    if (String.isNullOrWhiteSpace(gang.name)) {
      gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

      if (!gang) {
        return msg.createErrorReply('you are not in a gang.');
      }
    }

    const update = new msg.client.db.updates.IncMoney('wealth', args.amount);

    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update);

    return msg.createReply('you have successfully added ' + args.amount.USD() + ' to ' + (gang.leaderId === msg.author.id ? 'your gang' : gang.name) + '\'s wealth.');
  }
}

module.exports = new ModifyGangWealth();
