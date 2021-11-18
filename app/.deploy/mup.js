module.exports = {
  servers: {
    one: {
      host: '64.225.52.13',
      username: 'root',
      password: 'Guri66Truls'
    }
  },

  app: {
    name: 'bridging-the-gap',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      ROOT_URL: 'http://64.225.52.13',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      image: 'zodern/meteor:latest',
    },

    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  },
};

