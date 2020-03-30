class Constants {
  constructor() {
    this.data = {
      colors: {
        ban: [234, 12, 0],
        clear: [0, 29, 255],
        defaults: [
          [255, 38, 154],
          [0, 255, 0],
          [0, 232, 40],
          [8, 248, 255],
          [242, 38, 255],
          [255, 28, 142],
          [104, 255, 34],
          [255, 190, 17],
          [41, 84, 255],
          [150, 36, 237],
          [168, 237, 0]
        ],
        chill: [255, 92, 17],
        error: [255, 0, 0],
        kick: [232, 81, 31],
        mute: [255, 114, 14],
        unban: [19, 255, 25],
        unmute: [109, 237, 94],
        unchill: [91, 283, 53],
        warn: [255, 182, 32]
      },

      links: {
        botInvite: 'https://discordapp.com/oauth2/authorize?client_id=693879578405634129&scope=bot&permissions=8',
        serverInvite: 'https://discord.gg/UTm3SE'
      },

      messages: {
        jump: [
          'you were walking down the street when some homeless guy walked up to you, and then as you were giving him 17 cents you see the cracker has {0} worth of extra large socks stacked up behind him, so you jacked them.',
          'after a nice bust at the local strip club, you were walking home when you spotted Judge Woody, the cracker who busted you last week, sitting on a bench. You decided to jump his fatass, snipe {0} from his wallet, and walk away unharmed.',
          'you jump some dick that got you in court last month, stole his pants and ran. Turns out those pants were worth {0}.',
          'you decide to waltz over to Compton to show your strength. Fortunately, you found some wallet some guy dropped in a gang fight. The wallet didn\'t have jack inside of it, but the it turns out the leather it was made of was worth {0}.'
        ],
        lottery: [
          'CONGRATS MY MAN, you just won {0} in the goddamn lottery! Use `$info` for more information.',
          'hot fucking pockets, you just won {0} in the lottery! Use `$info` for more information.',
          'well sonny, looks like today is your goddamn lucky day, you just won {0} in the lottery! Use `$info` for more information.',
          'jiminy Crickets, you made some bank! You just won {0} from the lottery! Use `$info` for more information.',
          'sweet Baby Jesus you just won {0} in the fucking lottery! Use `$info` for more information.',
          'well I\'ll be damned, you just won {0} in the goddamn lottery! Use `$info` for more information.'
        ],
        scam: [
          'you ripped some grass off the ground, went up to some gangster and sold it to him as weed. He gave you {0} for it, and you got out of there before he noticed anything.',
          'you knocked on your neighbor\'s door, asked for some flour to bake a cake, and you sold it to your other neighbor as cocaine. You managed to make {0}.',
          'you bought a Monopoly board game, took the fake cash, went to the bank and traded it for USD. You walked away with {0}, moved to Cuba, while the US government was chasing you down.',
          'you waited in line for some new Adidas Yeezys, bought 10 pairs and sold them to your idiot friends for {0}. Hopefully they won\'t notice your scam.'
        ],
        steal: [
          'you and a couple of buddies decide to go bust out the fake nerf guns, stroll over to your local {0}, and rob their asses. You got {1} for your share.',
          'while you were shopping at {0}, you thought it was a good idea to nut all over the counter. The owner decided to sauce you {1} because he assumed the cum was toxic.'
        ],
        stores: [
          '7-Eleven', 'Speedway', 'Couche-Tard', 'QuikTrip', 'Kroger', 'Circle K', 'Admiral Petroleum', 'Big Apple', 'Bucky\'s Express'
        ],
        itemBreaking: [
          'you almost fucked up some hobo\'s cock with that broken {0}',
          'you hit some hobo\'s dick but his rock hard boner shattered your {0}',
          'that rusty old {0} that your grandpa gave you broke faster than I could nut',
          'out of nowhere your fat teacher comes and confiscates your {0}',
          'someone ratted you out to the cops and the SWAT team destroyed your {0}',
          'you want to hit a fat whip but you dropped your {0} and it shattered but you hit the fat whip',
          'you tried to slam a nigga but they surprise attacked and dropped you, taking your {0} and cashing it at a pawn shop',
          'the {0} hit socrates instead, he then turned it into a shit server and it broke.',
          'you got horny and tried to use {0} as a dildo, but you got it stuck and couldn\'t get it out.'
        ]
      },

      numbers: {
        thousand: 1000,
        million: 1000000,
        billion: 1000000000
      },

      misc: {
        clientOptions: {
          fetchAllMembers: true,
          messageCacheMaxSize: 100,
          messageCacheLifetime: 30,
          messageSweepInterval: 1800,
          disabledEvents: [
            'CHANNEL_PINS_UPDATE',
            'MESSAGE_UPDATE',
            'MESSAGE_REACTION_ADD',
            'MESSAGE_REACTION_REMOVE',
            'MESSAGE_REACTION_REMOVE_ALL',
            'VOICE_STATE_UPDATE',
            'TYPING_START',
            'VOICE_SERVER_UPDATE',
            'WEBHOOKS_UPDATE'
          ]
        },
        game: '$help',
        prefix: '$',
        botOwners: ['Luner#0059', 'Leo Messi Fan#1443'],
        ownerIds: ['226736342745219072', '271424970796564490']
      },

      regexes: {
        capitalize: /\w\S*/g,
        escape: /[-[\]{}()*+?.,\\/^$|#\s]/g,
        prefix: /^\$/
      }
    };

    this.guildSettings = {
      maxPrefix: 1
    };

    this.items = {
      suicide: {
        cost: 1500
      },

      types: ['gun', 'knife', 'meat', 'fish', 'crate', 'armour', 'ammo'],
      props: ['acquire_odds', 'crate_odds', 'item_odds', 'health', 'damage', 'accuracy', 'price', 'bullet']
    };

    this.config = {
      bounty: {
        min: 500
      },

      double: {
        min: 1000,
        maxWins: 5,
        odds: 60
      },

      investments: {
        line: {
          cost: 1000,
          description: 'One line of blow. Seems like nothing, yet it\'s enough to lower the message cooldown from 30 to 25 seconds.'
        },
        pound: {
          cost: 5000,
          description: 'This one pound of coke will double the amount of cash you get per message.'
        },
        kilo: {
          cost: 10000,
          description: 'A kilo of cocaine is more than enough to quadruple your cash per message.'
        },
        convoy: {
          cost: 25000,
          description: 'A fleet of ships will help distribute your drugs even faster, reducing all of your cooldowns by 5%.'
        },
        snowcap: {
          cost: 50000,
          description: 'A combination of brick and weed is enough to revive you one time.',
          time: 259200000
        }
      },

      polls: {
        elderTimeRequired: 172800000,
        maxAnswers: 6,
        maxAnswerChar: 40,
        maxChar: 40
      },

      stab: {
        cooldown: 14400000
      },

      shoot: {
        cooldown: 14400000
      },

      fish: {
        cooldown: 900000
      },

      hunt: {
        cooldown: 900000
      },

      opencrate: {
        cooldown: 60000
      },

      bully: {
        cooldown: 60000,
        maxLength: 32
      },

      reducedCooldown: 0.1,

      gang: {
        min: 500,
        maxChar: 24,
        killedMember: 0.05,
        cooldownRaid: 28800000,
        cooldownWithdraw: 14400000,
        cooldownTakeFromVault: 60000,
        creationCost: 2500,
        nameChange: 500,
        raidOdds: 80,
        maxUnique: 10,
        maxAmount: 50,
        maxMembers: 4
      },

      collect: {
        cooldown: 86400000
      },

      rob: {
        cooldown: 28800000,
        max: 0.2,
        min: 500,
        odds: 60
      },

      username: {
        minLength: 4,
        maxLength: 14
      },

      nsfw: {
        max: 20,
        min: 1,
        cooldown: 60000
      },

      chill: {
        max: 3600,
        min: 5,
        defaultValue: 30
      },

      clear: {
        max: 100,
        min: 2,
        cooldown: 1000
      },

      gambling: {
        minBet: 5
      },

      intervals: {
        autoUnmute: 60000,
        autoRemovePoll: 60000,
        autoTrivia: 300000,
        autoRegenHealth: 3600000
      },

      jump: {
        cooldown: 14400000,
        max: 500,
        min: 1000,
        odds: 85
      },

      kill: {
        cooldown: 86400000
      },

      lottery: {
        max: 1000,
        min: 9000,
        odds: 1.25,
        lotteryOddsMultiplier: 1
      },

      misc: {
        cashPerMessage: 50,
        leaderboardCap: 10,
        messageCooldown: 30000,
        rateLimitMessageCooldown: 5000,
        rateLimitMessageAmount: 8,
        minCharLength: 7,
        messageMultiplier: 1
      },

      mute: {
        defaultLength: 24
      },

      scam: {
        cooldown: 7200000,
        max: 100,
        min: 500,
        odds: 90
      },

      steal: {
        cooldown: 21600000,
        max: 1000,
        min: 2500,
        odds: 80
      },

      top50: {
        messageMultiplier: 1.5
      },

      transfer: {
        cut: 0.1,
        min: 5
      },

      rape: {
        odds: 50,
        cooldown: 14400000,
        cost: 0.10,
        minimum: 1000
      }
    };

    this.conversions = {
      secondInMs: 1000,
      minuteInMs: 60000,
      hourInMs: 3600000,
      dayInMs: 86400000,
      weekInMs: 604800000,
      monthInMs: 2592000000,
      yearInMs: 31536000000,
      decadeInMs: 315360000000,
      centuryInMs: 3153600000000
    };
  }
}

module.exports = new Constants();
