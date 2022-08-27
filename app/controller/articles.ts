// @ts-nocheck
import { Controller } from "egg";
import * as fs from 'fs';
import * as pump from 'pump';
import * as difference from 'lodash/difference';

const indexParams = {
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
  category: {
    type: 'enum',
    values: ['TECHNICAL', 'LIFE', 'PRIVACY', 'DRAFT'],
    default: "TECHNICAL",
    required: false,
  }
};

const createParams = {
  title: 'string',
  content: 'string'
}

export default class ArticleController extends Controller{
  // 文章列表
  async index(){
    const { ctx } = this;
    // 验证参数
    ctx.validate(indexParams,ctx.request.query);

    // 构建查询参数并查询
    const { page, size, category } = ctx.request.query;
    const articles = await ctx.service.article.findAll({page, size, category})

    // 返回结果
    ctx.response.success({
      data: articles
    })
  }

  // 新建
  async create(){
    const { ctx } = this;
    // 验证参数
    ctx.validate(createParams, ctx.request.body);

    // 构建参数并新建文章
    const { title, content } = ctx.request.body;
    const { _id: author } = ctx.state.user;    
    const article = await ctx.service.article.create({
      title, content, author
    });

    if(!article){
      return ctx.response.failure(
        config.ERR_TYPE.ARTICLE_NOT_EXIST
      )
    }

    // 返回结果
    ctx.response.success({
      message: '添加成功',
      data: article
    })
  }

  // 详情
  async show(){
    const { ctx, config } = this;
    const { id } = ctx.params;

    const article = await ctx.service.article.findById(id);
    if(!article){
      return ctx.response.failure(
        config.ERR_TYPE.ARTICLE_NOT_EXIST
      )
    }
    // 返回结果
    ctx.response.success({
      data: article
    })
  }

  // 更新
  async update(){
    const { ctx, config } = this;
    const { id } = ctx.params;
    // 验证参数
    ctx.validate(createParams, ctx.request.body);

    const article = await ctx.service.article.update(id, ctx.request.body);
    if(!article){
      return ctx.response.failure(
        config.ERR_TYPE.ARTICLE_NOT_EXIST
      )
    }
    // 返回结果
    ctx.response.success({
      message: '更新成功',
      data: article
    })
  }

  // 删除
  async destroy(){
    const { ctx, config } = this;
    const { id } = ctx.params;

    const article = await ctx.service.article.delete(id);
    if(!article){
      return ctx.response.failure(
        config.ERR_TYPE.ARTICLE_NOT_EXIST
      )
    }
    // 返回结果
    ctx.response.success({
      message: '删除成功'
    })
  }

  // 点赞
  async like(){
    const { ctx, config } = this;
    const { id } = ctx.params;

    const article = await ctx.service.article.like(id);
    if(!article){
      return ctx.response.failure(
        config.ERR_TYPE.ARTICLE_NOT_EXIST
      )
    }    
    ctx.response.success({
      message: '点赞成功'
    })
  }

  // 浏览
  async view(){
    const { ctx, config } = this;
    const { id } = ctx.params;

    const article = await ctx.service.article.view(id);
    if(!article){
      return ctx.response.failure(
        config.ERR_TYPE.ARTICLE_NOT_EXIST
      )
    }    
    ctx.response.success()
  }

  // 更新文章额外信息
  async updateInfo(){
    const { ctx, config } = this;
    const { id } = ctx.params;
    const body = ctx.request.body

    // 解析form-data
    const {fields, files} = await ctx.helper.parse(ctx.req);
    let {describe, category, tags, removeCover} = fields;
    tags = JSON.parse(fields.tags);
    category = category || 'DRAFT';

    // 验证 id
    const article = await ctx.service.article.findById(id);
    if(!article){
      return ctx.response.failure(
        config.ERR_TYPE.ARTICLE_NOT_EXIST
      )
    }

    // 图片上传
    const file = files.cover;
    let dir;
    if(file){
      const stream = fs.createReadStream(file._writeStream.path)      
      dir = await this.service.upload.getUploadFile(file.originalFilename, 'cover');
      const writeStream = fs.createWriteStream(dir.uploadDir + '.png')
      await pump(stream, writeStream);
    }

    const originCover = article.cover;
    const originTags = article.tags.map(item => String(item._id));
    const addTags = difference(tags, originTags);
    const removeTags = difference(originTags, tags);

    await ctx.service.article.updateInfo(id, {
      describe,
      category,
      tags,
      cover: removeCover ? '' : file ? dir.saveDir + '.png': originCover
    })

    // 删除旧图片
    if((file && originCover) || removeCover){
      const originUrl = ctx.origin.replace(/^http:/i, 'https:')
      await fs.unlinkSync(originCover.replace(originUrl, 'app'))
    }
    if(addTags.length){
      await ctx.service.tag.tagAddArticle(addTags, id)
    }
    if(removeTags.length){
      await ctx.service.tag.tagRemoveArticle(removeTags, id)
    }
    const data = await ctx.service.article.findById(id);
    // 返回结果
    ctx.response.success({
      message: '更新成功',
      data: data
    })
  }
}