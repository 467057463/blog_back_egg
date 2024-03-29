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
    describe: {
      type: String,
      required: false
    },
    cover: {
      type: String,
      required: false
    },
    category: {
      type: String,
      enum: ['TECHNICAL', 'LIFE', 'PRIVACY', 'DRAFT'],
      default: 'DRAFT'
    },
    tags: [{
      ref: 'Tag',
      type: Schema.Types.ObjectId,     
    }],
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