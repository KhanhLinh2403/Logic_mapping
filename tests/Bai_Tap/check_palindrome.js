// Cách 1: Sử dụng phương thức built-in
function isPalindrome(str) {
  // Bước 1: Chuyển về chữ thường và loại bỏ ký tự không phải chữ hoặc số
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Bước 2: Đảo ngược chuỗi
  const reversed = cleaned.split('').reverse().join('');

  // Bước 3: So sánh
  return cleaned === reversed;
}

console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("hello")); // false

// Cách 2: Sử dụng vòng lặp
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }

  return true;
}