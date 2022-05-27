// import * as jwt from 'jsonwebtoken';
import { Controller } from 'egg';

const UserType = {
  username: { type: 'string', required: true },
  password: { type: 'string', required: true },
};


export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }

  public async login(){
    const { ctx } = this;
    const body = ctx.request.body
    ctx.validate(UserType, body);

    const data = await ctx.service.user.login(body);
    if(data){
      ctx.body = {
        data: {
          dataList: data,
          dataMeta: ''
        },
        message: '登录成功',
        code: 0
      };
    } else {
      // ctx.body = '用户名或密码错误'
      ctx.body = {
        data: {
          dataList: '',
          dataMeta: ''
        },
        message: '用户名或密码错误',
        code: 1
      };
    }
  }

  public async register(){
    const { ctx } = this;
    const body = ctx.request.body
    ctx.validate(UserType, body);
    const users = await ctx.service.user.checkUserByName(body.username);
    if(users.length){
      // ctx.body = '用户名已存在'
      ctx.body = {
        data: {
          dataList: '',
          dataMeta: ''
        },
        message: '用户名已存在',
        code: 1
      };
      return;
    }
    await ctx.service.user.register(body);
    // ctx.body = '注册成功'
    ctx.body = {
      data: {
        dataList: '',
        dataMeta: ''
      },
      message: '注册成功',
      code: 0
    };
  }
}
