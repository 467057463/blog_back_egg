import { Service } from 'egg';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

export default class UploadService extends Service {
  async getUploadFile(filename, type = 'avatar') {
    const dir = path.join(this.config.uploadDir, type);
    await mkdirp(dir);

    const date = Date.now();
    let uploadDir = path.join(dir, date + path.extname(filename));
    const originUrl = this.ctx.origin.replace(/^http:/i, 'https:')
    return {
      uploadDir,
      saveDir: originUrl + uploadDir.slice(3).replace(/\\/g, '/')
    }
  } 
}