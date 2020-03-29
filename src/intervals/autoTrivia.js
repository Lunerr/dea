const Constants = require('../utility/Constants.js');
const PromiseUtil = require('../utility/PromiseUtil.js');
const Random = require('../utility/Random.js');

module.exports = async client => {
  client.setInterval(async () => {
    const guilds = await client.db.guildRepo.findMany();

    for (let i = 0; i < guilds.length; i++) {
      const questions = Object.keys(guilds[i].trivia);

      if (questions.length <= 0 || !guilds[i].autoTrivia) {
        continue;
      }

      const guild = await client.guilds.fetch(guilds[i].guildId);

      if (!guild || !guild.mainChannel) {
        continue;
      }

      const question = Random.arrayElement(questions);
      const answer = guilds[i].trivia[question];

      await guild.mainChannel.createMessage(question, { title: 'Trivia!' });

      const result = await guild.mainChannel.awaitMessages(m => m.content.toLowerCase().includes(answer.toLowerCase()), { time: 90000, max: 1 });

      if (result.size >= 1) {
        const prize = Random.nextInt(500, 2500);

        await client.db.userRepo.modifyCash(guilds[i], result.first().member, prize);
        await guild.mainChannel.createMessage('Congratulations ' + result.first().author.tag.boldify() + ' for winning ' + prize.USD() + ' in trivia!');
      } else {
        await guild.mainChannel.createMessage('Damn you fuckers were that slow and retarded.\nFINE I\'ll give you the answer, it\'s: ' + answer.boldify());
      }
    }

    await PromiseUtil.delay(15000);
  }, Constants.config.intervals.autoTrivia);
};
