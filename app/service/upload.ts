import { Service } from 'egg';
import * as path from 'path';
// import * as dayjs from 'dayjs';
// const mkdirp = require('mkdirp');
import * as mkdirp from 'mkdirp';

export default class UploadService extends Service {
  async getUploadFile(filename, type = 'avatar') {
    // const day = dayjs().format('YYYYMMDD');
    const dir = path.join(this.config.uploadDir, type);
    await mkdirp(dir);

    const date = Date.now();
    let uploadDir = path.join(dir, date + path.extname(filename));
    return {
      uploadDir,
      saveDir: this.ctx.origin + uploadDir.slice(3).replace(/\\/g, '/')
    }
  } 
}