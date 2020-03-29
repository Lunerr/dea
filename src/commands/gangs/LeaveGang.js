const patron = require('patron.js');
const handler = require('../../structures/handler.js');

class LeaveGang extends patron.Command {
  constructor() {
    super({
      names: ['leavegang'],
      groupName: 'gangs',
      description: 'Leave\'s gang.',
      preconditions: ['ingang']
    });
  }

  async run(msg) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (msg.author.id === gang.leaderId) {
      return msg.createErrorReply('you cannot leave you\'re the leader of the gang, please pass membership to another member of the gang or destroy the gang.');
    }

    const leader = await msg.guild.members.fetch(gang.leaderId);
    const update = x => new msg.client.db.updates.Pull(x, msg.author.id);

    if (gang.elders.includes(msg.author.id)) {
      await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('elders'));
    } else if (gang.members.includes(msg.author.id)) {
      await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('members'));
    }

    const raid = msg.client.registry.commands.find(x => x.names.includes('raid'));

    await handler.mutex.sync(msg.guild.id, async () => {
      const exists = raid.cooldowns[msg.author.id + '-' + msg.guild.id];

      if (exists !== undefined && exists - Date.now() > 0) {
        raid.cooldowns[msg.author.id + '-' + msg.guild.id] = undefined;
      }
    });

    await leader.tryDM(msg.author.tag.boldify() + ' has left your gang ' + gang.name.boldify() + '.', { guild: msg.guild });

    return msg.createReply('you\'ve successfully left ' + gang.name + '.');
  }
}

module.exports = new LeaveGang();
