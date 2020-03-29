const patron = require('patron.js');
const { config: { gang: { maxUnique, maxAmount } } } = require('../../utility/Constants.js');
const ItemService = require('../../services/ItemService.js');

class DumpVault extends patron.Command {
  constructor() {
    super({
      names: ['dumpvault', 'dump', 'dumpitems'],
      groupName: 'gangs',
      description: 'Dump your inventory into a gangs vault.',
      preconditions: ['ingang']
    });
  }

  async run(msg) {
    const inv = Object.keys(msg.dbUser.inventory).filter(x => msg.dbUser.inventory[x] > 0);

    if (!inv.length) {
      return msg.createErrorReply('you don\'t have any items to dump into your gang\'s vault.');
    }

    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });
    const vault = Object.keys(gang.vault).filter(x => gang.vault[x] > 0);

    if (vault.length >= maxUnique && vault.every(x => gang.vault[x] >= maxAmount)) {
      return msg.createErrorReply('your gang\'s vault cannot hold any more items.');
    }

    const has = inv.filter(x => gang.vault[x] && gang.vault[x] < maxAmount);
    const passedFilter = [...new Set(has.concat(inv.filter(x => !gang.vault[x] || gang.vault[x] < maxAmount)))].slice(0, maxUnique + has.length - vault.length);
    const needs = vault.filter(x => gang.vault[x] < maxAmount && !inv.includes(x));

    if (!passedFilter.length && needs.length) {
      return msg.createErrorReply('you don\'t have any of the following item' + (needs.length > 1 ? 's' : '') + ' to dump: ' + needs.map(ItemService.capitializeWords).join(', ') + '.');
    }

    let dumped = '';
    const items = {
      inv: {},
      vault: {}
    };

    for (let i = 0; i < passedFilter.length; i++) {
      const item = passedFilter[i];
      const amount = gang.vault[passedFilter[i]] && gang.vault[passedFilter[i]] + msg.dbUser.inventory[passedFilter[i]] > maxAmount
        ? maxAmount - gang.vault[passedFilter[i]]
        : msg.dbUser.inventory[passedFilter[i]] > maxAmount
          ? maxAmount
          : msg.dbUser.inventory[passedFilter[i]];
      dumped += ItemService.capitializeWords(item) + (amount > 1 ? 's' : '') + ': ' + amount + (i !== passedFilter.length - 1 ? '\n' : '');

      items.inv['inventory.' + item] = -amount;
      items.vault['vault.' + item] = amount;
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: items.inv });
    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $inc: items.vault });

    const leader = await msg.guild.members.fetch(gang.leaderId);

    await leader.tryDM(msg.author.tag + ' has just dumped the following into your gang\'s vault:\n' + dumped, { guild: msg.guild });

    return msg.createReply('you have successfully dumped the following into your gang\'s vault:\n' + dumped);
  }
}

module.exports = new DumpVault();
