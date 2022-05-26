import { Controller } from "egg";

export default class ArticleController extends Controller{
  async index(){
    const { ctx } = this;
    ctx.body = await ctx.service.article.findAll()
  }

  async create(){
    const { ctx } = this;
    const body = ctx.request.body;
    console.log(body)
    body.author = '6056fe0cf781b13b8412d706'
    const article = await ctx.service.article.create(body);
    ctx.body = {
      message: '发布成功',
      data: article
    }
  }
}