var config;
config = {
  test: {
    redis: {
      port: 6378
    }
  },
  development: {
    redis: {
      port: 6380
    }
  },
  production: {
    redis: {
      port: 6379
    }
  }
};

module.exports = config;
