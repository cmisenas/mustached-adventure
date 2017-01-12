REPORTER = 'nyan'
TEST_REDIS_PORT = 6378

test:
	redis-server test-redis.conf &
	@NODE_ENV=test mocha -u tdd --compilers coffee:coffee-script/register --reporter $(REPORTER)
	redis-cli -p $(TEST_REDIS_PORT) SHUTDOWN

start-server:
	redis-server dev-redis.conf &
	@NODE_ENV=development node bin/server.js

.PHONY: test
