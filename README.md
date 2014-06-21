memento-client
====

[![Build Status](http://img.shields.io/travis/jarofghosts/memento-client.svg?style=flat)](https://travis-ci.org/jarofghosts/memento-client)
[![npm install](http://img.shields.io/npm/dm/memento-client.svg?style=flat)](https://www.npmjs.org/package/memento-client)

simple interface to the wayback machine

## usage

```js
var memento = require('memento-client')

memento(url, timestamp, listAll)

function listAll(err, mementos) {
  console.log(mementos) // [{href: url, rel: identifier, datetime: timestamp}]
}
```

## notes

* `identifier` is one of: `first memento`, `prev memento`, `next memento`,
  `memento`, or `last memento`.
* finds nearest available memento for `url` to `timestamp`
* `timestamp` can be any reasonable approximation of a datetime and it should
  Just Work(tm)
* filters out non-mementos from response (timegate and original url)
* first and last entries in response will always be the first and last
  mementos available.

## license

MIT
