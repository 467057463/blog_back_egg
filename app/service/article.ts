import { Service } from 'egg';

export default class ArticleService extends Service {
  findAll(page = 1, quantity = 10){
    return this.ctx.model.Article.find()
      .populate('author', 'username')
      .sort({'createdAt':-1})
      .skip((page - 1) * quantity)
      .limit(quantity)
      .exec()
  }


  async create(article){
    console.log(article)
    const articles = await this.ctx.model.Article.create(article);
    return articles.save()
  }
}