const products = [
  { sku: "A001", name: "T-shirt", active: true },
  { sku: "A002", name: "Hoodie", active: false },
  { sku: "A001", name: "T-shirt", active: true },
  { sku: "A003", name: "Cap", active: true },
  { sku: "A002", name: "Hoodie", active: false },
];

const seenSku = new Set();

const result = products.filter(product => {
// Chỉ lấy sản phẩm active === true
// return false ==> true = lấy, false = bỏ
  if (!product.active) return false;
// Loại bỏ sản phẩm trùng nhau theo sku
  if (seenSku.has(product.sku)) return false;
// Lưu sku vào Set để lần sau không lấy lại
  seenSku.add(product.sku);
  return true;
});

console.log(result);
