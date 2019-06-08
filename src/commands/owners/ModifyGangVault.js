const patron = require('patron.js');

class ModifyGangWealth extends patron.Command {
  constructor() {
    super({
      names: ['modifygangvault', 'modifyvault', 'modvault', 'modifyganginventory', 'modganginventory', 'modganginv', 'modifyganginv'],
      groupName: 'owners',
      description: 'Modifies the specified gang\'s vault.',
      args: [
        new patron.Argument({
          name: 'amount',
          key: 'amount',
          type: 'amount',
          example: '1000'
        }),
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'intervention'
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

    const inventory = 'vault.' + args.item.names[0];

    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $inc: { [inventory]: args.amount } });
    const s = args.amount > 1 ? 's' : '';

    return msg.createReply('you have successfully added ' + args.amount + ' ' + args.item.names[0] + s + ' to ' + (gang.leaderId === msg.author.id ? 'your gang' : gang.name) + '\'s vault.');
  }
}

module.exports = new ModifyGangWealth();
