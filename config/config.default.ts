import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.security = {
    csrf: {
      enable: false,
    },
  };
  // jwt
  config.jwt = {
    secret: '_mmisme_1567156',
  };
  // 密码加密
  config.bcrypt = {
    saltRounds: 10,
  };

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1653556376955_3213';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    mongoose: {
      client: {
        url: 'mongodb://m2:123456@localhost/blog',
        options: {
          useNewUrlParser: true,
        },
      }
    }
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
