export default {
  // 系统错误, -10000级别
  UNKNOWN_ERROR: { code: '-10000', message: 'Internal server error.' }, // 未知错误
  NOT_EXIST_ROUTE: { code: '-10001', message: 'The route does not exist' }, // 路由不存在
  // 上游系统错误 -20000级别
  UP_SYS_TIME_OUT: { code: '-20001', message: 'Upstream system timeout.' }, // 上游系统超时
  // 业务错误，-30000级别
  NOT_LOGIN: { code: '-30001', message: 'Not login.' }, // 未登录
  USERNAME_PASSWORD_ERR: {code: '-30002', message: '用户名或密码错误'},
  USERNAME_EXIST: {code: '-30003', message: '用户名已存在'},
  ARTICLE_NOT_EXIST: {code: '-30004', message: '文章不存在'}
}