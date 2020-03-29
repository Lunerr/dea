const NumberUtil = require('../utility/NumberUtil.js');

class RankService {
  async handle(dbUser, dbGuild, member, users) {
    await member.guild.members.fetch(member.client.user);

    if (!member.guild.me.hasPermission('MANAGE_ROLES')) {
      return;
    }

    const sortedUsers = users.sort((a, b) => b.cash - a.cash);
    const position = sortedUsers.findIndex(v => v.userId === dbUser.userId) + 1;
    const highsetRolePosition = member.guild.me.roles.highest.position;
    const rolesToAdd = [];
    const rolesToRemove = [];
    const cash = NumberUtil.realValue(dbUser.cash);

    for (const rank of dbGuild.roles.rank) {
      const role = await member.guild.roles.fetch(rank.id);

      if (role && role.position < highsetRolePosition) {
        if (!member.roles.has(role.id)) {
          if (cash >= rank.cashRequired) {
            rolesToAdd.push(role);
          }
        } else if (cash < rank.cashRequired) {
          rolesToRemove.push(role);
        }
      }
    }

    this.topHandle(position, 10, dbGuild, highsetRolePosition, member, rolesToAdd, rolesToRemove);
    this.topHandle(position, 25, dbGuild, highsetRolePosition, member, rolesToAdd, rolesToRemove);
    this.topHandle(position, 50, dbGuild, highsetRolePosition, member, rolesToAdd, rolesToRemove);

    if (rolesToAdd.length > 0) {
      return member.roles.add(rolesToAdd);
    } else if (rolesToRemove.length > 0) {
      return member.roles.remove(rolesToRemove);
    }
  }

  async getRank(dbUser, dbGuild, guild) {
    let role;
    const cash = NumberUtil.realValue(dbUser.cash);

    for (const rank of dbGuild.roles.rank.sort((a, b) => a.cashRequired - b.cashRequired)) {
      if (cash >= rank.cashRequired) {
        role = await guild.roles.fetch(rank.id);
      }
    }

    return role;
  }

  async topHandle(position, numb, dbGuild, highsetRolePosition, member, rolesToAdd, rolesToRemove) {
    const role = await member.guild.roles.fetch(dbGuild.roles['top' + numb]);

    if (role && role.position < highsetRolePosition) {
      if (!member.roles.has(role.id)) {
        if (position <= numb) {
          rolesToAdd.push(role);
        }
      } else if (position > numb) {
        rolesToRemove.push(role);
      }
    }
  }
}

module.exports = new RankService();
