// Load enviroment variables from the file, if the app status is not production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
require('babel-register');

const _ = require('lodash');

const token = process.env.BOT_TOKEN;
const Discord = require('discord.js');
const client = new Discord.Client();

function weekdayToNum(day) {
  if (_.lowerCase(day) == 'monday') return 1;
  if (_.lowerCase(day) == 'tuesday') return 2;
  if (_.lowerCase(day) == 'wednesday') return 3;
  if (_.lowerCase(day) == 'thursday') return 4;
  if (_.lowerCase(day) == 'friday') return 5;
  if (_.lowerCase(day) == 'saturday') return 6;
  if (_.lowerCase(day) == 'sunday') return 7;
  return new Error('Invalid day');
}

const allowedTimes = [
  {
    day: 'Tuesday',
    start: '23:00',
    end: '23:52',
  },
  {
    day: 'Wednesday',
    start: '00:00',
    end: '02:00',
  }
];

function showNotAllowedMessage(message) {
  let msg = 'Tämä keskusteluryhmä on avoinna seuraavina aikoina:\n';
  _.forEach(allowedTimes, t => {
    msg += `${ t.day }: ${t.start}-${t.end}.\n`;
  });
  message.reply(msg);
}

client.on("message", function(message) {
  if (message.author.bot) return; // Don't reply to bots
  
  const now = new Date();
  let isAllowed = false;
  _.forEach(allowedTimes, t => {
    if (now.getDay() == weekdayToNum(t.day)) {
      console.log(t.day, 'is allowed');
      
      const from = Date.parse(`01/01/2011 ${ t.start }`);
      const to = Date.parse(`01/01/2011 ${ t.end }`);
      const cur = Date.parse(`01/01/2011 ${ now.getHours() }:${ now.getMinutes() }`); // There must be a better way to do this...

      if (from <= cur && cur <= to) {
        console.log('time', now.toLocaleString(), 'allowed');
        isAllowed = true;
      } else {
        console.log('time', now.toLocaleString(), 'not allowed');
      }
      return;
    } else {
      console.log(t.day, 'is not allowed currently');
    }
  });

  if (!isAllowed) {
    showNotAllowedMessage(message);
  }
}); 


client.login(token);