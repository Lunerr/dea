const patron = require('patron.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');
const handler = require('../../structures/handler.js');

class JoinGang extends patron.Command {
  constructor() {
    super({
      names: ['joingang'],
      groupName: 'gangs',
      description: 'Asks leader to join his gang.',
      preconditions: ['notingang'],
      args: [
        new patron.Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'Cloud9Swags',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (args.gang.members.length + args.gang.elders.length >= Constants.config.gang.maxMembers) {
      return msg.createErrorReply('sorry, this gang is too full.');
    }

    const leader = await msg.guild.members.fetch(args.gang.leaderId);

    if (!leader) {
      return msg.createReply('the leader of that gang is no longer in this server. ***RIP GANG ROFL***');
    }

    if (!leader.user.dmChannel) {
      await leader.createDM();
    }

    const key = Random.nextInt(0, 2147000000).toString();

    const dm = await leader.tryDM(msg.author.tag.boldify() + ' is trying to join your gang, reply with "' + key + '" within the next 5 minutes to accept this.', { guild: msg.guild });

    if (!dm) {
      return msg.createErrorReply('I am unable to inform ' + leader.user.tag.boldify() + ' of your join request.');
    }

    await msg.createReply('the leader of this gang has successfully been informed of your join request.');

    const result = await leader.user.dmChannel.awaitMessages(m => m.author.id === leader.id && m.content.includes(key), { time: 300000, max: 1 });

    if (result.size >= 1) {
      const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

      if (gang) {
        await leader.tryDM(msg.author.tag.boldify() + ' has already joined a gang.', { guild: msg.guild });

        return msg.author.tryDM('you\'re unable to join ' + args.gang.name.boldify() + ' since you\'re already in a gang.', { guild: msg.guild });
      }

      const raid = msg.client.registry.commands.find(x => x.names.includes('raid'));
      const gangMembers = args.gang.members.concat(args.gang.elders, args.gang.leaderId);
      const cooldowns = gangMembers
        .filter(x => raid.cooldowns[x + '-' + msg.guild.id] !== undefined && raid.cooldowns[x + '-' + msg.guild.id] - Date.now() > 0)
        .map(x => raid.cooldowns[x + '-' + msg.guild.id]);

      if (cooldowns.length) {
        await handler.mutex.sync(msg.guild.id, async () => {
          const highest = Math.max(...cooldowns);

          raid.cooldowns[msg.author.id + '-' + msg.guild.id] = highest;
        });
      }

      const update = new msg.client.db.updates.Push('members', msg.author.id);

      await msg.client.db.gangRepo.updateGang(args.gang.leaderId, msg.guild.id, update);
      await leader.tryDM('You\'ve successfully let ' + msg.author.tag.boldify() + ' join your gang.', { guild: msg.guild });

      return msg.author.tryDM('You\'ve successfully joined the gang ' + args.gang.name.boldify() + '.', { guild: msg.guild });
    }

    return msg.author.tryDM(leader.user.tag.boldify() + ' didn\'t respond to your join request.', { guild: msg.guild });
  }
}

module.exports = new JoinGang();
