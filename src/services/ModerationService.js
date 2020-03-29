const Constants = require('../utility/Constants.js');

class ModerationService {
  getPermLevel(dbGuild, member) {
    if (member.guild.ownerID === member.id) {
      return 3;
    }

    let permLevel = 0;

    for (const modRole of dbGuild.roles.mod.sort((a, b) => a.permissionLevel - b.permissionLevel)) {
      if (member.guild.roles.has(modRole.id) && member.roles.has(modRole.id)) {
        permLevel = modRole.permissionLevel;
      }
    }

    return member.hasPermission('ADMINISTRATOR') && permLevel < 2 ? 2 : permLevel;
  }

  tryInformUser(guild, moderator, action, user, reason = '') {
    return user.tryDM(moderator.tag.boldify() + ' has ' + action + ' you' + (String.isNullOrWhiteSpace(reason) ? '.' : ' for the following reason: ' + reason + '.'), { guild });
  }

  async tryModLog(dbGuild, guild, action, color, reason = '', moderator = null, user = null, extraInfoType = '', extraInfo = '') {
    if (!dbGuild.channels.modLog) {
      return false;
    }

    const channel = await guild.channels.fetch(dbGuild.channels.modLog);

    if (!channel) {
      return false;
    }

    const options = {
      color,
      footer: {
        text: 'Case #' + dbGuild.misc.caseNumber,
        icon: 'http://i.imgur.com/BQZJAqT.png'
      },
      timestamp: true
    };

    if (moderator) {
      options.author = {
        name: moderator.tag,
        icon: moderator.displayAvatarURL(),
        URL: Constants.data.links.botInvite
      };
    }

    let description = '**Action:** ' + action + '\n';

    if (!String.isNullOrWhiteSpace(extraInfoType)) {
      description += '**' + extraInfoType + ':** ' + extraInfo + '\n';
    }

    if (user) {
      description += '**User:** ' + user.tag + ' (' + user.id + ')\n';
    }

    if (!String.isNullOrWhiteSpace(reason)) {
      description += '**Reason:** ' + reason + '\n';
    }

    await guild.client.db.guildRepo.upsertGuild(dbGuild.guildId, { $inc: { 'misc.caseNumber': 1 } });

    return channel.tryCreateMessage(description, options);
  }
}

module.exports = new ModerationService();
