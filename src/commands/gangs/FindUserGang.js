const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class FindUserGang extends patron.Command {
  constructor() {
    super({
      names: ['findusergang'],
      groupName: 'gangs',
      description: 'Finds a user\'s gang.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'nigger#9384',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: args.member.id }, { elders: args.member.id }, { leaderId: args.member.id }], $and: [{ guildId: msg.guild.id }] });

    if (!gang) {
      return msg.createErrorReply('this user is not in a gang.');
    }

    let leader = '';
    let members = '';
    let elders = '';

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

module.exports = new FindUserGang();
