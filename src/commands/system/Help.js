const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Help extends patron.Command {
  constructor() {
    super({
      names: ['help', 'commands', 'command', 'cmd', 'cmds', 'support', 'docs'],
      groupName: 'system',
      description: 'All command information.',
      usableContexts: [patron.Context.DM, patron.Context.Guild],
      args: [
        new patron.Argument({
          name: 'command',
          key: 'command',
          type: 'string',
          defaultValue: '',
          example: 'money'
        })
      ]
    });
  }

  async run(msg, args) {
    if (String.isNullOrWhiteSpace(args.command)) {
      await msg.author.DM(msg.client.user.username + ' is **THE** cleanest bot around, and you can have it in **YOUR** server simply by clicking here: ' + Constants.data.links.botInvite + '.\n\nFor all information about a module and their commands do `' + Constants.data.misc.prefix + 'module [module]`.\n\nThe `' + Constants.data.misc.prefix + 'help <command>` command may be used for view the usage and an example of any command.\n\nIf you have **ANY** questions, you may join the **Official RealiLife Discord Server:** ' + Constants.data.links.serverInvite + ' for instant support along with a great community.');

      if (msg.channel.type !== 'dm') {
        return msg.createReply('you have been DMed with all the command information!');
      }
    } else {
      args.command = args.command.startsWith(Constants.data.misc.prefix) ? args.command.slice(Constants.data.misc.prefix.length) : args.command;

      const lowerInput = args.command.toLowerCase();
      const command = msg.client.registry.commands.find(x => x.names.some(y => y === lowerInput));

      if (!command) {
        return msg.createErrorReply('this command does not exist.');
      }

      return msg.channel.createMessage('**Description:** ' + command.description + '\n**Usage:** `' + Constants.data.misc.prefix + command.getUsage() + '`\n**Example:** `' + Constants.data.misc.prefix + command.getExample() + '`', { title: command.names[0].upperFirstChar() });
    }
  }
}

module.exports = new Help();
