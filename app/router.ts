import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const jwt = app.jwt as any;
  
  router.get('/', controller.home.index);
  router.post('/login', controller.home.login);
  router.post('/register', controller.home.register)
  router.get('/articles', controller.articles.index)
  router.post('/articles', jwt, controller.articles.create)
};
