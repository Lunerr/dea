const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Gang extends patron.Command {
  constructor() {
    super({
      names: ['gang', 'findgang'],
      groupName: 'gangs',
      description: 'Finds a gang.',
      args: [
        new patron.Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'Cloud9Swags',
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
        return msg.createErrorReply('you\'re not in a gang so you must specify one.');
      }
    }

    let leader = '';
    let elders = '';
    let members = '';

    if (gang.leaderId && gang.leaderId) {
      const getLeader = await msg.guild.members.fetch(gang.leaderId);

      leader = getLeader.user.tag;
    } else {
      leader = 'Nobody';
    }

    if (gang.members.length) {
      for (let i = 0; i < gang.members.length; i++) {
        const member = gang.members[i];
        const grabMembers = await msg.guild.members.fetch(member);

        members += grabMembers.user.tag + ', ';
      }
    }

    if (gang.elders.length) {
      for (let i = 0; i < gang.elders.length; i++) {
        const elder = gang.elders[i];
        const grabElder = await msg.guild.members.fetch(elder);

        elders += grabElder.user.tag + ', ';
      }
    }

    return msg.channel.createMessage('**Gang:** ' + gang.name + '\n**Leader:** ' + leader + (gang.elders && gang.elders && gang.elders.length ? '\n**Elders:** ' + elders.substring(0, elders.length - 2) : '') + (gang.members && gang.members && gang.members.length ? '\n**Members:** ' + members.substring(0, members.length - 2) : '') + '\n**Wealth:** ' + NumberUtil.format(gang.wealth));
  }
}

module.exports = new Gang();
