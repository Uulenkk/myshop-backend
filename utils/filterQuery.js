export const buildProductQuery = (query) => {
  const filter = {};

  if (query.gender) filter.gender = query.gender;
  if (query.category) filter.category = query.category;
  if (query.type) filter.type = query.type;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.price.lte = parseFloat(query.maxPrice);
  }

  return filter;
};

export const buildSort = (query) => {
  if (query.sort === 'price-asc') return { price: 'asc' };
  if (query.sort === 'price-desc') return { price: 'desc' };
  return { createdAt: 'desc' }; // default sort
};
