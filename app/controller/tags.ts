// @ts-nocheck
import { Controller } from "egg";

const CreateTagParams = {
  name: {
    type: 'string',
    reuqired: true,
    max: 10
  }
}

const TagArticlesParams = {
  page: { 
    type: 'int', 
    convertType: 'int',
    required: false, 
    min: 1, 
    default: 1
  },
  size: { 
    type: 'int', 
    convertType: 'int',
    required: false, 
    max: 100, 
    default: 10 
  },
}

export default class TagController extends Controller{
  // 标签列表 -获取所有标签
  async index(){
    const { ctx } = this;

    const tags = await ctx.service.tag.findAllTags();
    ctx.response.success({
      data: tags
    })
  }

  // 添加标签
  async create(){
    const { ctx, config } = this;
    // 验证参数
    ctx.validate(CreateTagParams, ctx.request.body);
    const { name } = ctx.request.body;

    const tag = await ctx.service.tag.createTag(name);
    if(!tag){
      return ctx.response.failure(
        config.ERR_TYPE.TAG_IS_EXIST
      )
    }
    ctx.response.success({
      data: tag
    })
  }

  // 获取标签下的文章
  async tagArticles(){
    const { ctx, config } = this;
    const { id } = ctx.params;
    // 验证参数
    ctx.validate(TagArticlesParams,ctx.request.query);

    // 构建查询参数并查询
    const { page, size } = ctx.request.query;
    const articles = await ctx.service.tag.tagArticles(id, page, size) 

    // 格式化数据并返回
    ctx.response.success({
      data: articles
    })
  }
}