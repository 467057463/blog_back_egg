// @ts-nocheck
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const jwt = app.jwt;
  
  router.post('/api/v1/users/login', controller.users.login);
  router.post('/api/v1/users/register', controller.users.register)
  router.post('/api/v1/users/upload_avatar', jwt, controller.users.uploadAvatar)

  router.get('/api/v1/articles', controller.articles.index)
  router.post('/api/v1/articles', jwt, controller.articles.create)
  router.get('/api/v1/articles/:id', controller.articles.show)
  router.put('/api/v1/articles/:id', jwt, controller.articles.update)
  router.delete('/api/v1/articles/:id', jwt, controller.articles.destroy)
  router.post('/api/v1/articles/:id/like', jwt, controller.articles.like)
  router.post('/api/v1/articles/:id/view', jwt, controller.articles.view)
  router.post('/api/v1/articles/:id/update_info', jwt, controller.articles.updateInfo)

  router.get('/api/v1/tags', controller.tags.index);
  router.post('/api/v1/tags', jwt, controller.tags.create);
};
