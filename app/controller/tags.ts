// @ts-nocheck
import { Controller } from "egg";

const CreateTagParams = {
  name: {
    type: 'string',
    reuqired: true,
    max: 10
  }
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
}