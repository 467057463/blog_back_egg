// @ts-nocheck
import { Controller } from "egg";
import * as fs from 'fs';
import * as pump from 'pump';
import * as formidable from 'formidable';
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
  // category: {
  //   type: 'string',
  //   required: false,
  //   default: "{}"
  // }
};

const createParams = {
  title: 'string',
  content: 'string'
}

const UpdateInfoParams = {
  cover: {
    type: 'string',
    required: false
  },
  category: {
    type: 'enum',
    values: ['TECHNICAL', 'LIFE', 'PRIVACY', 'DRAFT'],
    default: 'DRAFT',
    required: false
  },
  selectTags: {
    type: 'array',
    itemType: "string",
    required: false
  },
  newTags: {
    type: 'array',
    itemType: "string",
    required: false
  }
}

const CreateTagParams = {
  name: {
    type: 'string',
    reuqired: true,
    max: 10
  }
}
export default class ArticleController extends Controller{
  // 文章列表
  async index(){
    const { ctx } = this;
    // 验证参数
    ctx.validate(indexParams,ctx.request.query);

    // 构建查询参数并查询
    const { page, size } = ctx.request.query;
    const articles = await ctx.service.article.findAll(page, size)

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

  // 获取所有标签
  async tags(){
    const { ctx } = this;

    const tags = await ctx.service.article.findAllTags();
    ctx.response.success({
      data: tags
    })
  }

  // 新建标签
  async createTags(){
    const { ctx, config } = this;
    // 验证参数
    ctx.validate(CreateTagParams, ctx.request.body);
    const { name } = ctx.request.body;

    const tag = await ctx.service.article.createTag(name);
    if(!tag){
      return ctx.response.failure(
        config.ERR_TYPE.TAG_IS_EXIST
      )
    }
    ctx.response.success({
      data: tag
    })
  }

  parse(req) {
    const form = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            resolve({ fields, files });
        });
    });
  }

  // 更新文章额外信息
  async updateInfo(){
    const { ctx, config } = this;
    const { id } = ctx.params;
    const body = ctx.request.body

    const {fields, files} = await this.parse(ctx.req);
    let {category, tags} = fields;
    tags = JSON.parse(fields.tags);
    // console.log(category, tags)

    // ctx.validate(UpdateInfoParams, body);
    const article = await ctx.service.article.findById(id);
    if(!article){
      return ctx.response.failure(
        config.ERR_TYPE.ARTICLE_NOT_EXIST
      )
    }

    // 图片上传
    const file = files.cover;
    const stream = fs.createReadStream(file._writeStream.path)
    const dir = await this.service.upload.getUploadFile(file.originalFilename, 'cover');
    const writeStream = fs.createWriteStream(dir.uploadDir)
    await pump(stream, writeStream);

    const originCover = article.cover;
    const originTags = article.tags.map(item => String(item._id));
    const addTags = difference(tags, originTags);
    const removeTags = difference(originTags, tags);
    // console.log(tags, originTags, addTags, removeTags)

    await ctx.service.article.updateInfo(id, {
      category,
      tags,
      cover: dir.saveDir
    })
    // 删除旧图片
    await fs.unlinkSync(originCover.replace(ctx.origin, 'app'))
    if(addTags.length){
      await ctx.service.article.tagAddArticle(addTags, id)
    }
    if(removeTags.length){
      await ctx.service.article.tagRemoveArticle(removeTags, id)
    }
    const res = await ctx.service.article.findById(id);
    // 返回结果
    ctx.response.success({
      message: '更新成功',
      data: res
    })
  }
}