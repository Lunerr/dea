const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Mute extends patron.Command {
  constructor() {
    super({
      names: ['mute'],
      groupName: 'moderation',
      description: 'Mute any member.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Billy Steve#0711"',
          preconditions: ['nomoderator']
        }),
        new patron.Argument({
          name: 'quantity of hours',
          key: 'hours',
          type: 'float',
          example: '48',
          defaultValue: Constants.config.mute.defaultLength
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          defaultValue: '',
          example: 'was spamming like a chimney',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const role = await msg.guild.roles.fetch(msg.dbGuild.roles.muted);

    const formattedHours = args.hours + ' hour' + (args.hours === 1 ? '' : 's');

    if (!msg.dbGuild.roles.muted) {
      return msg.createErrorReply('you must set a muted role with the `' + Constants.data.misc.prefix + 'setmute @Role` command before you can mute users.');
    } else if (args.member.roles.has(msg.dbGuild.roles.muted)) {
      return msg.createErrorReply('this user is already muted.');
    }

    if (!role) {
      return msg.createErrorReply('rhe set muted role has been deleted. Please set a new one with the `' + Constants.data.misc.prefix + 'setmute Role` command.');
    }

    await args.member.roles.add(role);
    await msg.createReply('you have successfully muted ' + args.member.user.tag + ' for ' + formattedHours + '.');
    await msg.client.db.muteRepo.insertMute(args.member.id, msg.guild.id, NumberUtil.hoursToMs(args.hours));
    await ModerationService.tryInformUser(msg.guild, msg.author, 'muted', args.member.user, args.reason);

    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Mute', Constants.data.colors.mute, args.reason, msg.author, args.member.user, 'Length', formattedHours);
  }
}

module.exports = new Mute();
