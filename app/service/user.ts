import { Service } from 'egg';
import * as bcrypt from 'bcryptjs';

export default class UserService extends Service {
  // 根据用户名查找
  async checkUserByName(username){
    const users = await this.ctx.model.User.find({username});
    return users;
  }

  // 注册
  async register(body){
    const { username, password } = body;
    const hash = bcrypt.hashSync(password, this.config.bcrypt.saltRounds);
    const user = await this.ctx.model.User.create({username, password: hash})
    return user;
  }

  // 登录
  async login(body){
    const { username, password } = body;
    const user = await this.ctx.model.User.findOne({
      username
    })
    if(!user){
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if(match){
      const { _id } = user;
      const { jwt: { secret } } = this.ctx.app.config;
      const token = this.ctx.app.jwt.sign(
        {username, _id}, secret, {expiresIn:60 * 60 * 24 * 30}
      )
      return {
        user,
        token
      }
    }
  }
}