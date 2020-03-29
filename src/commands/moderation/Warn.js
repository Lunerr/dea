const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Warn extends patron.Command {
  constructor() {
    super({
      names: ['warn'],
      groupName: 'moderation',
      description: 'Warn any member.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Killa Nigga#2222"',
          preconditions: ['nomoderator']
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'stop jerking off in public like cmon man',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const role = await msg.guild.roles.fetch(msg.dbGuild.roles.warn);

    if (!role) {
      return msg.createErrorReply('the set warned role has been deleted. Please set a new one with the `' + Constants.data.misc.prefix + 'setwarningrole @Role` command.');
    } else if (!msg.dbGuild.roles.muted) {
      return msg.createErrorReply('you must set a muted role with the `' + Constants.data.misc.prefix + 'setmuted @Role` command before you can warn users.');
    } else if (!msg.dbGuild.roles.warn) {
      return msg.createErrorReply('you must set a warned role with the `' + Constants.data.misc.prefix + 'setwarningrole @Role` command before you can warn users.');
    } else if (args.member.roles.has(msg.dbGuild.roles.warn)) {
      await msg.createReply('are you sure you wish to warn ' + args.member.user + ' he already has the warned role, type "yes" if you want to warn him again, or "no" if u want him to be muted for 4 hours.');

      const filter = x => x.content.toLowerCase() === 'yes' && x.author.id === msg.author.id;
      const result = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });
      const filter2 = x => x.context.toLowerCase() === 'no' && x.author.id === msg.author.id;
      const result2 = await msg.channel.awaitMessages(filter2, { max: 1, time: 3000 });

      if (result.size === 1) {
        await msg.createReply('you have successfully warned ' + args.member.user.tag + '.');
        await ModerationService.tryInformUser(msg.guild, msg.author, 'warned', args.member.user, args.reason);

        return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Warn', Constants.data.colors.warn, args.reason, msg.author, args.member.user);
      } else if (result2.size === 1) {
        const role2 = await msg.guild.roles.fetch(msg.dbGuild.roles.muted);
        const formattedHours = '4 hours';

        await args.member.roles.add(role2);
        await msg.createReply('you have successfully muted ' + args.member.user.tag + ' for ' + formattedHours + '.');
        await msg.client.db.muteRepo.insertMute(args.member.id, msg.guild.id, NumberUtil.hoursToMs(4));
        await ModerationService.tryInformUser(msg.guild, msg.author, 'muted', args.member.user, args.reason);

        return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Mute', Constants.data.colors.mute, args.reason, msg.author, args.member.user, 'Length', formattedHours);
      }
    }

    await args.member.roles.add(role);
    await msg.createReply('you have successfully warned ' + args.member.user.tag + '.');
    await ModerationService.tryInformUser(msg.guild, msg.author, 'warned', args.member.user, args.reason);

    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Warn', Constants.data.colors.warn, args.reason, msg.author, args.member.user);
  }
}

module.exports = new Warn();
