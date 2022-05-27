import { Controller } from "egg";

const listRule = {
  page: { type: 'integer', required: false, min: 1, default: 1},
  size: { type: 'integer', required: false, max: 100, default: 10 },
};

export default class ArticleController extends Controller{
  async index(){
    const { ctx } = this;
    ctx.validate(listRule,ctx.request.query);
    const articles = await ctx.service.article.findAll(ctx.request.query as any)
    ctx.body = {
      data: {
        dataList: articles,
        dataMeta: ''
      },
      message: '',
      code: 0
    };
  }

  async create(){
    const { ctx } = this;
    const body = ctx.request.body;
    // console.log(ctx.state.user)
    body.author = ctx.state.user._id
    const article = await ctx.service.article.create(body);
    // ctx.body = {
    //   message: '发布成功',
    //   data: article
    // }
    ctx.body = {
      data: {
        dataList: article,
        dataMeta: ''
      },
      message: '发布成功',
      code: 0
    };
  }
}