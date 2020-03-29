const Constants = require('../utility/Constants.js');
const RateLimit = require('../structures/RateLimit.js');

class RateLimitService {
  constructor() {
    this.messages = new Map();
  }

  async initiate(msg) {
    const lastMessage = this.messages.get(msg.author.id);
    const isMessageCooldownOver = !lastMessage || Date.now() - lastMessage.time > Constants.config.misc.rateLimitMessageCooldown;

    if (!isMessageCooldownOver) {
      if (lastMessage.messages > Constants.config.misc.rateLimitMessageAmount) {
        if (!await msg.client.db.blacklistRepo.anyBlacklist(msg.author.id)) {
          const botOwners = Constants.data.misc.ownerIds;

          for (let i = 0; i < botOwners.length; i++) {
            const botOwner = await msg.client.users.fetch(botOwners[i]);

            await botOwner.tryDM(msg.author.toString() + ' (' + msg.author.id + ') was blacklisted.\nGuild: ' + msg.guild.name +
              ' (' + msg.guild.id + ')\nChannel: ' + msg.channel.name + ' (' + msg.channel.id + ')\nContent: ' + msg.content);
          }

          await msg.createReply('you were automatically blacklisted for rate-limiting.');

          return msg.client.db.blacklistRepo.insertBlacklist(msg.author.id, msg.author.tag, msg.author.displayAvatarURL());
        }
      }

      lastMessage.messages++;
    } else {
      return this.messages.set(msg.author.id, new RateLimit());
    }
  }
}

module.exports = new RateLimitService();
