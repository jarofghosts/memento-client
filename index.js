var linkParser = require('http-link').parse
var concat = require('concat-stream')
var request = require('hyperquest')

var formatTime = require('./lib/format-time')

var GATE_URL = 'http://web.archive.org/web/timemap/link/'

module.exports = memento

function memento (url, opts, cb) {
  var gateway

  if (!cb) {
    cb = opts
    opts = {}
  }

  gateway = opts.host || GATE_URL

  if (!opts.time) {
    return getAll()
  }

  var headers = {'accept-datetime': formatTime(opts.time)}

  request(gateway + url, {headers: headers}, parseResponse)

  function parseResponse (err, res) {
    if (err) {
      return cb(err)
    }

    if (!res.headers.link || !res.headers.link.length) {
      return cb(null, [])
    }

    try {
      cb(null, linkParser(res.headers.link).filter(nonMementos))
    } catch (e) {
      cb(e)
    }
  }

  function getAll () {
    request(gateway + url, parseTimemaps)
  }

  function parseTimemaps (err, res) {
    if (err) {
      return cb(err)
    }

    if (res.statusCode === 404) {
      return cb(null, [])
    } else if (res.statusCode !== 200) {
      return cb(new Error('request failure ' + res.statusCode))
    }

    res.pipe(concat(parseLinks))

    function parseLinks (result) {
      if (!result || !result.length) {
        return cb(null, [])
      }

      result = result.toString()

      try {
        cb(null, linkParser(result))
      } catch (e) {
        cb(e)
      }
    }
  }
}

function nonMementos (x) {
  return x && x.rel && x.rel !== 'original' && x.rel !== 'timemap'
}
