memento-client
==============

[![Build Status](http://img.shields.io/travis/jarofghosts/memento-client.svg?style=flat)](https://travis-ci.org/jarofghosts/memento-client)
[![npm install](http://img.shields.io/npm/dm/memento-client.svg?style=flat)](https://www.npmjs.org/package/memento-client)

simple interface to memento services

## usage

```js
var memento = require('memento-client')

memento(url, listAll)

function listAll(err, mementos) {
  console.log(mementos) // [{href: url, rel: identifier, datetime: timestamp}]
}

// provide an options object with time to narrow your search!
memento(url, {time: '2010'}, list2010)

function list2010(err, mementos) {
  console.log(mementos) // all found from 2010
}

// also optionally provide your own host's timemap! (defaults to the wayback machine)

memento(url, {host: 'http://some-other-memento-provider/timemap'}, getCustom)

function getCustom(err, mementos) {
  // ta-da!
}
```

## notes

* `identifier` is one of: `first memento`, `prev memento`, `next memento`,
  `memento`, or `last memento`.
* finds nearest available memento for `url` to `opts.time`
* `opts.time` can be any reasonable approximation of a datetime and it should
  Just Work(tm)
* filters out non-mementos from response (timegate and original url)
* first and last entries in response will always be the first and last
  mementos available.

## license

MIT
