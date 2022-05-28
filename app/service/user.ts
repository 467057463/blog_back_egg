import { Service } from 'egg';
import * as bcrypt from 'bcryptjs';

export default class UserService extends Service {
  // 根据用户名查找
  async checkUserByName(username){
    return await this.ctx.model.User.findOne({username});
  }

  // 注册
  async register(body){
    const { username, password } = body;

    // 检查用户是否存在
    const user = await this.checkUserByName(username)
    if(user) return;

    // 创建用户
    const hash = bcrypt.hashSync(password, this.config.bcrypt.saltRounds);
    return await this.ctx.model.User.create({username, password: hash});
  }

  // 登录
  async login(body){
    const { username, password } = body;

    // 检查用户是否存在
    const user = await this.checkUserByName(username)
    if(!user) return;

    // 检查密码是否匹配
    const match = await bcrypt.compare(password, user.password);
    if(!match) return;
    
    // 生成token
    const token = this.app.jwt.sign(
      {username, _id: user._id}, 
      this.config.jwt.secret, 
      // @ts-ignore
      {expiresIn: this.config.jwt.expiresIn}
    )

    return {
      user,
      token
    }
  }
}