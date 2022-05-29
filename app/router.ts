// @ts-nocheck
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const jwt = app.jwt;
  
  // router.get('/', controller.home.index);
  router.post('/login', controller.home.login);
  router.post('/register', controller.home.register)
  router.post('/upload_avatar', jwt, controller.home.uploadAvatar)

  router.get('/articles', controller.articles.index)
  router.get('/articles/tags', controller.articles.tags)
  router.post('/articles/tags', jwt, controller.articles.createTags)
  router.post('/articles', jwt, controller.articles.create)
  router.get('/articles/:id', controller.articles.show)
  router.put('/articles/:id', jwt, controller.articles.update)
  router.delete('/articles/:id', jwt, controller.articles.destroy)
  router.post('/articles/:id/like', jwt, controller.articles.like)
  router.post('/articles/:id/view', jwt, controller.articles.view)
  router.post('/articles/:id/update_info', jwt, controller.articles.updateInfo)
};
