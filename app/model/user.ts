import { Application } from 'egg';

export default (app: Application) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    username: {
      type: String,
      required: [true, '用户名不能为空'],
      unique: true,
      minlength: ['6', '用户名长度不能低于6个字符'],
      validate: {
        validator: function(v){
          return /^[\d\w]{6,16}$/.test(v)
        },
        message: '请输入6-16位数字或字符串'
      }
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false
    }
  },{
    timestamps:true
  })

  return mongoose.model('User', UserSchema);
}