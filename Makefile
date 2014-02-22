REPORTER = 'nyan'

test:
	@NODE_ENV=test mocha -u tdd --compilers coffee:coffee-script --reporter $(REPORTER)

test-watch:
	@NODE_ENV=test mocha -u tdd --compilers coffee:coffee-script \
		--reporter $(REPORTER) \
		--growl \
		--watch

start-server:
	@NODE_ENV=development node bin/server.js

.PHONY: test
