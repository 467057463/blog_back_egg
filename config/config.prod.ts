import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {
    mongoose: {
      client: {
        url: 'mongodb://localhost/blog',
        options: {
          useNewUrlParser: true,
          user: 'xxx',
          pass: 'xxxxxx'
        },
      }
    },
  };
  return config;
};
