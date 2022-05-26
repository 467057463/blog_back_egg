import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  static: true,
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
};

export default plugin;
