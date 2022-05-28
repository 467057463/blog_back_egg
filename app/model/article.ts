import { Application } from 'egg';
export default (app: Application) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ArticleSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // comments: [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'Comment'
    // }],
    meta: {
      view: {
        type: Number,
        default: 0
      },
      like: {
        type: Number,
        default: 0
      },
      likeUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }]
    }
  },{
    timestamps:true,
    toJSON: { 
      virtuals: true 
    }
  })

  return mongoose.model('Article', ArticleSchema);
}