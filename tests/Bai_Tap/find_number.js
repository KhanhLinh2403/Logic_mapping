function findMissingNumber(arr) {
  const n = arr.length; 
  const set = new Set(arr);

  for (let i = 0; i <= n; i++) {
    if (!set.has(i)) {
      return i;
    }
  }
}

console.log(findMissingNumber([0, 1, 1, 3]));
// n = 4 → số từ 0 đến 4
// Thiếu 2 và 4 → trả về 2 (số thiếu đầu tiên)

console.log(findMissingNumber([3, 0, 1])); 
// n = 3 → số từ 0 đến 3
// Thiếu 2 → kết quả: 2