import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import ERR_TYPE from './error';
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
    // @ts-ignore
    expiresIn: '30d'
  };
  // 密码加密
  config.bcrypt = {
    saltRounds: 10,
  };

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1653556376955_3213';

  // add your egg config in here
  config.middleware = ['errorHandler'];

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
    },
    ERR_TYPE
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
