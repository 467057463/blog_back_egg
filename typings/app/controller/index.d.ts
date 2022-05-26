// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticles from '../../../app/controller/articles';
import ExportHome from '../../../app/controller/home';

declare module 'egg' {
  interface IController {
    articles: ExportArticles;
    home: ExportHome;
  }
}
