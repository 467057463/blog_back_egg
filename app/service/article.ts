import { Service } from 'egg';

export default class ArticleService extends Service {
  findAll({page, size}){
    return this.ctx.model.Article.find()
      .populate('author', 'username')
      .sort({'createdAt':-1})
      .skip((page - 1) * size)
      .limit(size)
      .exec()
  }


  async create(article){
    console.log(article)
    const articles = await this.ctx.model.Article.create(article);
    return articles.save()
  }
}