var http = require('http')
var util = require('util')

var findPort = require('portfinder').getPort
var test = require('tape')

var formatTime = require('../lib/format-time')
var memento = require('../')

var timeRex = /\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT/

test('always returns time in correct format', function (t) {
  t.plan(2)

  t.ok(timeRex.test(formatTime('2012')))
  t.ok(timeRex.test(formatTime(Date.now())))
})

test('makes request correctly', function (t) {
  t.plan(2)

  var server

  findPort(makeServer)

  function makeServer (err, port) {
    if (err) {
      return t.fail(err)
    }

    server = createServer(testRequest, port, makeRequest)

    function makeRequest () {
      var opts = {
        host: 'http://localhost:' + port + '/timemap/link/'
      }

      memento('http://herp.derp', opts, testResponse)
    }

    function testRequest (req, res) {
      t.equal(req.url, '/timemap/link/http://herp.derp')
      res.end()
    }
  }

  function testResponse (err, res) {
    if (err) {
      return t.fail(err)
    }

    t.deepEqual(res, [])
    server.close()
  }
})

test('returns empty array on 404', function (t) {
  t.plan(1)

  var server

  findPort(makeServer)

  function makeServer (err, port) {
    if (err) {
      return t.fail(err)
    }

    server = createServer(testRequest, port, makeRequest)

    function makeRequest () {
      var opts = {
        host: 'http://localhost:' + port + '/timemap/link/'
      }

      memento('http://herp.derp', opts, testResponse)
    }

    function testRequest (req, res) {
      res.writeHead(404)
      res.end()
    }
  }

  function testResponse (err, res) {
    if (err) {
      return t.fail(err)
    }

    t.deepEqual(res, [])
    server.close()
  }
})

test('returns err on non-200/404 response', function (t) {
  t.plan(1)

  var server

  findPort(makeServer)

  function makeServer (err, port) {
    if (err) {
      return t.fail(err)
    }

    server = createServer(testRequest, port, makeRequest)

    function makeRequest () {
      var opts = {
        host: 'http://localhost:' + port + '/timemap/link/'
      }

      memento('http://herp.derp', opts, testResponse)
    }

    function testRequest (req, res) {
      res.writeHead(500)
      res.end()
    }
  }

  function testResponse (err, res) {
    t.true(util.isError(err))
    server.close()
  }
})

test('sends along datetime header if time option specified', function (t) {
  t.plan(2)

  var server

  findPort(makeServer)

  function makeServer (err, port) {
    if (err) {
      return t.fail(err)
    }

    server = createServer(testRequest, port, makeRequest)

    function makeRequest () {
      var opts = {
        host: 'http://localhost:' + port + '/',
        time: '2007'
      }

      memento('http://herp.derp', opts, server.close.bind(server))
    }

    function testRequest (req, res) {
      t.equal(req.url, '/http://herp.derp')
      t.equal(req.headers['accept-datetime'], formatTime('2007'))
      res.setHeader('link', '<http://herp.derp>; rel="original"')
      res.end()
    }
  }
})

function createServer (handler, port, cb) {
  return http.createServer(handler).listen(port, cb)
}
