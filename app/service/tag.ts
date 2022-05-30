import { Service } from 'egg';

export default class TagService extends Service {
  // 获取所有标签
  async findAllTags(){
    return this.ctx.model.Tag.find()
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
}