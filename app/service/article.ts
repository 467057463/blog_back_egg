import { Service } from 'egg';

export default class ArticleService extends Service {
  // 列表
  async findAll({page, size, category}){
    const { ctx } = this;
    // 计算分页偏移量
    const offset = ctx.helper.calcPagingOffset(page, size);
    const count = await ctx.model.Article.find({category}).count();
    const list = await  ctx.model.Article.find({category})
      .populate('author', 'username')
      .populate('tags', 'name')
      .sort({'createdAt':-1})
      .skip(offset)
      .limit(size)
      .exec()
    
    // 格式化数据并返回
    return ctx.helper.formatPagingData({ page, size, count, list });
  }

  // 新建
  async create(article){
    return await this.ctx.model.Article.create(article);
  }

  // 检查 _id 是否存在
  async findIdExists(id){
    try {      
      return await this.ctx.model.Article.findById(id).count()
    } catch (error) {
      return false;
    }
  }

  // 详情
  async findById(id){
    // 检查是否存在
    const isExists = await this.findIdExists(id)
    if(!isExists){
      return;
    }
    return this.ctx.model.Article.findById(id)
      .populate('author', 'username')
      .populate('tags', 'name')
      .populate({
        path: 'comments',
        populate: { 
          path: 'author',
          select: 'username'
        }
      })
  }

  // 更新
  async update(id, {title, content}){
    // 检查是否存在
    const isExists = await this.findIdExists(id)
    if(!isExists){
      return;
    }
    return this.ctx.model.Article.updateOne({_id: id}, {$set: {
      title, content
    }})
  }

  // 删除
  async delete(id){
    // 检查是否存在
    const isExists = await this.findIdExists(id)
    if(!isExists){
      return;
    }
    return this.ctx.model.Article.findOneAndDelete({_id: id})
  }

  // 点赞
  async like(id){
    // 检查是否存在
    const isExists = await this.findIdExists(id)
    if(!isExists){
      return;
    }

    return this.ctx.model.Article.updateOne({_id: id}, {$inc: {
      'meta.like': 1
    }})
  }

  // 浏览
  async view(id){
    // 检查是否存在
    const isExists = await this.findIdExists(id)
    if(!isExists){
      return;
    }

    return this.ctx.model.Article.updateOne({_id: id}, {$inc: {
      'meta.view': 1
    }})
  }

  // 更新文章信息
  async updateInfo(id, {cover, tags, category}){
     // 检查是否存在
     const isExists = await this.findIdExists(id)
     if(!isExists){
       return;
     }
     return this.ctx.model.Article.findOneAndUpdate({_id: id}, {$set: {
      cover, tags, category
     }})
  }
}