var config;
config = {
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
