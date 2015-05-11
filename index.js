var linkParser = require('http-link').parse
  , request = require('hyperquest')

var formatTime = require('./lib/format-time')

var GATE_URL = 'http://web.archive.org/web/timemap/link/'

module.exports = memento

function memento(url, opts, cb) {
  var gateway

  if(!cb) {
    cb = opts
    opts = {}
  }

  gateway = opts.host || GATE_URL

  if(!opts.time) {
    return getAll()
  }

  var headers = {'accept-datetime': formatTime(opts.time)}

  request(gateway + url, {headers: headers}, parseResponse)

  function parseResponse(err, res) {
    if(err) return cb(err)
    if(!res.headers.link || !res.headers.link.length) return cb(null, [])

    try {
      var links = linkParser(res.headers.link).filter(nonMementos);
      cb(null, links);
    } catch (e) {
      cb(e);
    }
  }

  function getAll() {
    request(gateway + url, parseTimemaps)
  }

  function parseTimemaps(err, res) {
    if(err) return cb(err)
    if (res.statusCode !== 200) {
      return cb(null, []);
    }

    var result = ''

    res.on('data', function(data) {
      result += data
    })

    res.on('end', function() {
      if(!result || !result.length) return cb(null, [])

      try {
        var links = linkParser(result);
        cb(null, links);
      } catch (e) {
        cb(e);
      }
    })
  }
}

function nonMementos(x) {
  return x && x.rel && x.rel !== 'original' && x.rel !== 'timemap'
}
