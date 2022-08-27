import { Service } from 'egg';

export default class TagService extends Service {
  // 获取所有标签
  async findAllTags(){
    return this.ctx.model.Tag.find({},{name: 1})
  }

  // 根据名称查找标签
  async findTagByName(name){
    return this.ctx.model.Tag.findOne({name})
  }

  // 新建标签
  async createTag(name){
    const tag = await this.findTagByName(name);
    if(tag){
      return;
    }
    return this.ctx.model.Tag.create({name})
  }

  // 标签添加文章
  async tagAddArticle(tags, articleId){
    await this.ctx.model.Tag.updateMany({_id: {
        $in: tags
      }
    }, {
      $push: {
        articles: articleId
      }
    })    
  }
  
  // 标签删除文章
  async tagRemoveArticle(tags, articleId){
    await this.ctx.model.Tag.updateMany({_id: {
        $in: tags
      }
    }, {
      $pull: {
        articles: articleId
      }
    })
  }

  // 获取标签下文章总数
  async tagArticlesCount(id){
    return this.ctx.model.Tag.findById(id)
  }

  // 获取标签下的文章
  async tagArticles(id, page = 1, size = 10){
    // 计算分页偏移量
    const offset = this.ctx.helper.calcPagingOffset(page, size);

    const countRes = await this.ctx.model.Tag.findById(id);
    const listRes = await this.ctx.model.Tag.findOne({_id: id}, {
      _id: 0,
      name: 0,
      articles: {
        $slice: [offset, size],
        $match: {
          category: 'TECHNICAL'
        },
        $sort: {'createdAt':-1}
      }
    })
    // .populate('articles')
    .populate({
      path: 'articles',
      populate:[{
        path: 'author',
        model: 'User',
        select: "username"
      }, {
        path: 'tags',
        model: 'Tag',
        select: "name"
      }]
    })

    const list = listRes.articles;
    const count = countRes.articles.length;

    return this.ctx.helper.formatPagingData({ page, size, count, list })
  }
}