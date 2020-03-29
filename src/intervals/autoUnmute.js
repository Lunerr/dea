const Constants = require('../utility/Constants.js');
const ModerationService = require('../services/ModerationService.js');

module.exports = async client => {
  client.setInterval(async () => {
    const mutes = await client.db.muteRepo.findMany();

    for (let i = 0; i < mutes.length; i++) {
      if (mutes[i].mutedAt + mutes[i].muteLength > Date.now()) {
        continue;
      }

      await client.db.muteRepo.deleteById(mutes[i]._id);

      const guild = await client.guilds.fetch(mutes[i].guildId);

      if (!guild) {
        continue;
      }

      const member = guild.member(mutes[i].userId);

      if (!member) {
        continue;
      }

      const dbGuild = await client.db.guildRepo.getGuild(guild.id);
      const role = await guild.roles.fetch(dbGuild.roles.muted);

      if (!role || !member.roles.has(dbGuild.roles.muted)) {
        continue;
      }

      if (!guild.me.hasPermission('MANAGE_ROLES') || role.position >= guild.me.roles.highest.position) {
        continue;
      }

      await member.roles.remove(role);
      await ModerationService.tryModLog(dbGuild, guild, 'Automatic Unmute', Constants.data.colors.unmute, '', null, member.user);
      await ModerationService.tryInformUser(guild, client.user, 'automatically unmuted', member.user);
    }
  }, Constants.config.intervals.autoUnmute);
};
