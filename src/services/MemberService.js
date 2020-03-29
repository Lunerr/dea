class MemberService {
  async join(member) {
    const dbGuild = await member.client.db.guildRepo.getGuild(member.guild.id);

    if (dbGuild.roles.muted && await member.client.db.muteRepo.anyMute(member.id, member.guild.id)) {
      const role = await member.guild.roles.fetch(dbGuild.roles.muted);

      if (!role || !member.guild.me.hasPermission('MANAGE_ROLES') || role.position >= member.guild.me.roles.highest.position) {
        return;
      }

      return member.roles.add(role);
    }
  }
}

module.exports = new MemberService();
