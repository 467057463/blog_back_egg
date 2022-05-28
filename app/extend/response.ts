// @ts-nocheck
export default {
  success({data, status, message} = {}){
    const { ctx } = this;
    ctx.body = {
      code: '0',
      message: message || 'success',
      result: data || null,
      sysTime: ctx.helper.now()
    };
    ctx.status = status || 200;
  },

  failure({ status, code, message, data } = {}) {
    const { ctx } = this;
    ctx.body = {
      code: code || '-1',
      message: message || 'no message',
      result: data || null,
      sysTime: ctx.helper.now()
    };
    ctx.status = status || 200;
  },
}