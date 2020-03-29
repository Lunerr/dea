const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Unmute extends patron.Command {
  constructor() {
    super({
      names: ['unmute'],
      groupName: 'moderation',
      description: 'Unmute any member.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Jimmy Johnson#3636"'
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          defaultValue: '',
          example: 'bribed me 50k',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (!msg.dbGuild.roles.muted) {
      return msg.createErrorReply('you must set a muted role with the `' + Constants.data.misc.prefix + 'setmute @Role` command before you can unmute users.');
    } else if (!args.member.roles.has(msg.dbGuild.roles.muted)) {
      return msg.createErrorReply('this user is not muted.');
    }

    const role = await msg.guild.roles.fetch(msg.dbGuild.roles.muted);

    if (!role) {
      return msg.createErrorReply('the set muted role has been deleted. Please set a new one with the `' + Constants.data.misc.prefix + 'setmute Role` command.');
    }

    await args.member.roles.remove(role);
    await msg.client.db.muteRepo.deleteMute(args.member.id, msg.guild.id);
    await msg.createReply('you have successfully unmuted ' + args.member.user.tag + '.');
    await ModerationService.tryInformUser(msg.guild, msg.author, 'unmuted', args.member.user, args.reason);

    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Unmute', Constants.data.colors.unmute, args.reason, msg.author, args.member.user);
  }
}

module.exports = new Unmute();
