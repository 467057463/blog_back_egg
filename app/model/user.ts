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
          return /\d{3}-\d{3}-\d{4}/.test(v)
        },
        message: '用户名格式不对'
      }
    },
    password: {
      type: String,
      required: true
    }
  },{
    timestamps:true
  })

  return mongoose.model('User', UserSchema);
}