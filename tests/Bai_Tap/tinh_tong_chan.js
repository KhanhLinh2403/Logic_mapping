//CÁCH 1: Sử dụng vòng lặp và câu lệnh điều kiện
// let sum = 0;

// for (let i = 0; i <= 20; i++) {
//     if (i % 2 === 0) {
//         console.log(i);
//         sum += i;
//     }
// }

// console.log("Tổng các số chẵn từ 0 đến 20 là:", sum);


//CÁCH 2: Sử dụng vòng lặp với bước nhảy là 2
// let i = 0	Bắt đầu từ số chẵn đầu tiên
// i <= n	Lặp đến khi i ≤ n
// i += 2	Mỗi lần tăng 2 → luôn là số chẵn
function tongSoChan(n) {
  let sum = 0;
  for (let i = 0; i <= n; i += 2) {
    sum += i;
  }
  return sum;
}

console.log("Tổng các số chẵn từ 0 đến 20 là:", tongSoChan(20));
