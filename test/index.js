var test = require('tape')

var formatTime = require('../lib/format-time')

var timeRex = /\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT/ 

test('always returns time in correct format', function(t) {
  t.plan(2)

  t.ok(timeRex.test(formatTime('2012')))
  t.ok(timeRex.test(formatTime(Date.now())))
})
