import { Application } from 'egg';

export default (app: Application) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TagSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: ['10', '标签名不能超过10个字符']
    },
    articles: [{
      ref: 'Article',
      type: Schema.Types.ObjectId,      
    }]
  })

  return mongoose.model('Tag', TagSchema);
}