// @ts-nocheck
// import * as jwt from 'jsonwebtoken';
import { Controller } from 'egg';

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
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }

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
}
