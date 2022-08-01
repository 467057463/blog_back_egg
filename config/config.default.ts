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
  // 跨域配置
  config.cors = {
    origin: '*', // 表示允许的源
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH' // 表示允许的http请求方式
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
        // url: 'mongodb://95.179.164.10/blog',
        url: 'mongodb://localhost/blog',
        options: {
          useNewUrlParser: true,
          user: 'm2',
          pass: '123456'
        },
      }
    },
    ERR_TYPE,
    uploadDir: 'app/public/upload'
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
