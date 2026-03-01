// Cách 1: Sử dụng phương thức built-in
function reverseString(str) {
  return str.split('').reverse().join('');
}

console.log(reverseString("hello"));

// Cách 2: Sử dụng vòng lặp
function reverseString1(str) {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}

console.log(reverseString1("hello")); // "olleh"

// Cách 3: Sử dụng đệ quy
function reverseString(str) {
  if (str === "") return "";
  return reverseString(str.slice(1)) + str[0];
}

console.log(reverseString("hello")); // "olleh"