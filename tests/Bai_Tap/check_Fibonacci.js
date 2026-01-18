function isFibonacci(n) {
  if (n < 0) return false;
// Khởi tạo 2 số Fibonacci đầu tiên
  let a = 0;
  let b = 1;

  while (a <= n) {
    if (a === n) return true;
// Fibonacci tiếp theo = số hiện tại + số trước đó
    const next = a + b;
// a giờ là số Fibonacci mới 
    a = b;
// b trở thành số tiếp theo sau a
    b = next;
  }

  return false;
}
console.log(isFibonacci(4)); // true