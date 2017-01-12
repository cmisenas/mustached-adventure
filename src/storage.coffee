config = require('../config')

class Storage
  constructor: (mod, port, host, options) ->
    store = require(mod)
    if process.env.REDIS_URL?
      rtg   = require("url").parse(process.env.REDIS_URL)
      @client = store.createClient(rtg.port, rtg.hostname)
      @client.auth(rtg.auth.split(":")[1])
    else if process.env.REDISTOGO_URL?
      rtg   = require("url").parse(process.env.REDISTOGO_URL)
      @client = store.createClient(rtg.port, rtg.hostname)
      @client.auth(rtg.auth.split(":")[1])
    else
      @client = store.createClient(port, host, options)

    @client.setnx("index", 0)
    @client.on("error", (error) ->
      console.log("ERROR: #{error}")
    )

  set: (key, vals, fn) ->
    if key == 'index' or key == ''
      fn(new Error('ERROR: Bad key'))
      return false
    @client.incr("index")
    addArr = []
    addArr.push(key)
    for val, index in vals
      addArr.push(index + 1, val)
    @client.zadd(addArr, fn)

  get: (hash, index, fn) ->
    @client.zrange(hash, index, index, fn)

  getIndex: (fn) ->
    @client.get('index', (error, response) =>
      if response == null
        @client.setnx("index", 0)
        response = 0
      fn(error, parseInt(response, 10))
    )

  sizeOf: (key, fn) ->
    @client.zcard(key, fn)

@Storage = Storage
