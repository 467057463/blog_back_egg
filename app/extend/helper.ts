import * as formidable from 'formidable';

export default {
  now(){
    return Date.now();
  },

  // 计算偏移值
  calcPagingOffset(page, size){
    return (size && page) ? size * (page - 1) : 0;
  },

  // 格式化分页数据
  formatPagingData({ page, size, count, list }) {
    const totalPage = Math.ceil(count / size);

    return {
      list: list || [],      
      meta: {
        currentPage: page,
        totalPage,
        size,
        hasPrev: page > 1 && page < totalPage,
        hasNext: page < totalPage,
        total: count,
      }
    };
  },

  // 解析 form-data
  parse(req){
    const form = new formidable.IncomingForm();
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if(err){
          reject(err)
        }
        resolve({ fields, files });
      });
    });
  }
}