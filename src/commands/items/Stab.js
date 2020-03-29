const patron = require('patron.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');
const ItemService = require('../../services/ItemService.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const items = require('../../data/items.json');

class Stab extends patron.Command {
  constructor() {
    super({
      names: ['stab'],
      groupName: 'items',
      description: 'Stab a user with specified knife.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.stab.cooldown,
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          preconditions: ['noself'],
          example: '"Blast It Baby#6969"'
        }),
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'huntsman knife',
          preconditionOptions: [{ types: ['knife'] }],
          preconditions: ['nottype', 'donthave', 'allied'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const roll = Random.roll();
    const dbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);
    const damage = await ItemService.reduceDamage(dbUser, args.item.damage, items);
    const shotUser = await await msg.client.users.fetch(args.member.id);

    if (args.item.crate_odds >= Random.roll()) {
      const inv = 'inventory.' + args.item.names[0];

      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [inv]: -1 } });

      return msg.createErrorReply(Random.arrayElement(Constants.data.messages.itemBreaking).format(args.item.names[0].boldify()));
    }

    if (roll <= args.item.accuracy) {
      if (dbUser.health - damage <= 0) {
        if (dbUser.investments.includes('snowcap')) {
          await msg.createReply('you tried to kill ' + args.member.user.tag.boldify() + ', but their snowcap investment saved their ass.');
          await shotUser.tryDM(msg.author.tag.boldify() + ' tried to kill you, but your snowcap brought you back to life.', { guild: msg.guild });

          const update = { $pull: { investments: 'snowcap' }, $set: { revivable: Date.now() + 1000 * 60 * 60 * 24 * 2, health: 100 } };

          return msg.client.db.userRepo.updateUser(args.member.id, msg.guild.id, update);
        }

        await ItemService.takeInv(msg.author.id, args.member.id, msg.guild.id, msg.client.db);
        await msg.client.db.userRepo.modifyCashExact(msg.dbGuild, msg.member, dbUser.bounty);
        await msg.client.db.userRepo.modifyCashExact(msg.dbGuild, msg.member, dbUser.cash);

        const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: args.member.id }, { elders: args.member.id }, { leaderId: args.member.id }], $and: [{ guildId: msg.guild.id }] });
        let amount = 0;

        if (gang && NumberUtil.realValue(gang.wealth) > Constants.config.gang.min) {
          amount = NumberUtil.round(gang.wealth * Constants.config.gang.killedMember, 2);

          await msg.client.db.userRepo.modifyCashExact(msg.dbGuild, msg.member, amount);
          await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, new msg.client.db.updates.IncMoney('wealth', -NumberUtil.realValue(amount)));
        }

        const totalEarning = dbUser.bounty + dbUser.cash + amount;

        await msg.client.db.userRepo.deleteUser(args.member.id, msg.guild.id);
        await shotUser.tryDM('Unfortunately, you were killed by ' + msg.author.tag.boldify() + ' using a ' + ItemService.capitializeWords(args.item.names[0]) + '. All your data has been reset.', { guild: msg.guild });

        return msg.createReply('woah, you just killed ' + args.member.user.tag.boldify() + '. You just earned ' + NumberUtil.format(totalEarning) + ' **AND** their inventory, congrats.');
      }

      await msg.client.db.userRepo.updateUser(args.member.id, msg.guild.id, { $inc: { health: -damage } });

      const newdbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);

      await shotUser.tryDM(msg.author.tag.boldify() + ' tried to kill you, but nigga you *AH, HA, HA, HA, STAYIN\' ALIVE*. -' + damage + ' health. Current Health: ' + newdbUser.health, { guild: msg.guild });

      return msg.createReply('just stabbed that nigga in the heart, you just dealt ' + damage + ' damage to ' + args.member.user.tag.boldify() + '.');
    }
    return msg.createReply('this nigga actually did some acrobatics shit and bounced out of the way before you stabbed him.');
  }
}

module.exports = new Stab();
