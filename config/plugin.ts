import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  static: true,
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  }, 
  validate: {
    enable: true,
    package: 'egg-validate',
  },
};

export default plugin;
