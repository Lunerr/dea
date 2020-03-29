const Constants = require('../utility/Constants.js');

module.exports = async client => {
  client.setInterval(async () => {
    const polls = await client.db.pollRepo.findMany();

    for (let i = 0; i < polls.length; i++) {
      const pollLength = polls[i].length;
      const pollCreatedAt = polls[i].createdAt;
      let choices = '';

      if (Date.now() - pollCreatedAt - pollLength <= 0) {
        continue;
      }

      await client.db.pollRepo.deleteById(polls[i]._id);

      const guild = await client.guilds.fetch(polls[i].guildId);

      if (!guild) {
        continue;
      }

      const creator = guild.member(polls[i].creatorId);

      if (!creator) {
        continue;
      }

      for (const key in polls[i].choices) {
        choices += '`' + key + '` Votes: ' + polls[i].choices[key] + ',\n';
      }

      await creator.user.tryDM(choices + 'Final Poll Results Of ' + polls[i].name + ' Poll In Server ' + guild.name + '.');
    }
  }, Constants.config.intervals.autoRemovePoll);
};
