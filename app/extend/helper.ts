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
  }
}