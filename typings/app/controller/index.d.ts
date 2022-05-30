// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticles from '../../../app/controller/articles';
import ExportTags from '../../../app/controller/tags';
import ExportUsers from '../../../app/controller/users';

declare module 'egg' {
  interface IController {
    articles: ExportArticles;
    tags: ExportTags;
    users: ExportUsers;
  }
}
