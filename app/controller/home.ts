// @ts-nocheck
import { Controller } from 'egg';
import * as fs from 'fs';
import * as pump from 'pump';

const LoginParams = {
  username: { type: 'string', required: true },
  password: { type: 'string', required: true },
};

const RegisterParams = {
  username: {
    type: 'string',
    required: true,
    min: 6,
    max: 16
  },
  password: {
    type: 'string',
    required: true,
    min: 6
  }
}


export default class HomeController extends Controller {
  // 登录
  public async login(){
    const { ctx } = this;
    const body = ctx.request.body
    ctx.validate(LoginParams, body);

    const data = await ctx.service.user.login(body);
    if(data){
      ctx.response.success({
        data: data
      })    
      return; 
    }
    ctx.response.failure(
      this.config.ERR_TYPE.USERNAME_PASSWORD_ERR
    )
  }

  // 注册
  public async register(){
    const { ctx } = this;
    const body = ctx.request.body
    ctx.validate(RegisterParams, body);

    const user = await ctx.service.user.register(body);
    if(user){
      ctx.response.success()  
      return;
    }
    ctx.response.failure(
      this.config.ERR_TYPE.USERNAME_EXIST
    )
  }

  // 上传图像
  public async uploadAvatar(){
    const { ctx } = this;
    const { _id } = ctx.state.user;  
    const stream = await ctx.getFileStream();

    const dir = await this.service.upload.getUploadFile(stream.filename);
    const writeStream = fs.createWriteStream(dir.uploadDir)
    await pump(stream, writeStream);

    const user = await this.service.user.findById(_id)
    const avatar = user.avatar;
    await ctx.service.user.uploadAvatar(_id, dir.saveDir)
    await fs.unlinkSync(avatar.replace(ctx.origin, 'app'))
    ctx.response.success({
      data: dir
    })  
  }
}
