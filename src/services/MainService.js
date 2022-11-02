class MainService {
  static getPagination(page, size) {
    const limit = size ? +size : null;
    const offset = page ? page * limit : 0;

    return { limit, offset };
  }

  static getPagingData(items, page, limit) {
    const { count: totalItems, rows: data } = items;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      totalItems, data, totalPages, currentPage,
    };
  }
}

export default MainService;
