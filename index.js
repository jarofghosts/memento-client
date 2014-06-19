var linkParser = require('http-link').parse
  , concat = require('concat-stream')
  , request = require('hyperquest')

var formatTime = require('./lib/format-time')

var GATE_URL = 'http://web.archive.org/web/'

module.exports = memento

function memento(url, timestamp, cb) {
  var timestamp = formatTime(timestamp)
    , headers
    
  headers = {'Accept-Datetime': timestamp}

  request(GATE_URL + url, {headers: headers}, parseResponse)

  function parseResponse(err, res) {
    if(err) return cb(err)

    cb(null, linkParser(res.headers.link).filter(nonMementos))
  }
}

function nonMementos(x) {
  return x && x.rel && x.rel !== 'original' && x.rel !== 'timemap'
}
