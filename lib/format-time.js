var util = require('util')

var days = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]

var months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

module.exports = formatTime

function formatTime (timestamp) {
  var time = new Date(isNaN(timestamp) ? Date.parse(timestamp) : Number(timestamp))

  return util.format(
    '%s, %s %s %s %s:%s:%s GMT',
    days[time.getUTCDay()],
    pad(time.getUTCDate()),
    months[time.getUTCMonth()],
    time.getUTCFullYear(),
    pad(time.getUTCHours()),
    pad(time.getUTCMinutes()),
    pad(time.getUTCSeconds())
  )
}

function pad (x) {
  return ('0' + x).slice(-2)
}
