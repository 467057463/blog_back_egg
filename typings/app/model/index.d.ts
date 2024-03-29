// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle from '../../../app/model/article';
import ExportTag from '../../../app/model/tag';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Article: ReturnType<typeof ExportArticle>;
    Tag: ReturnType<typeof ExportTag>;
    User: ReturnType<typeof ExportUser>;
  }
}
