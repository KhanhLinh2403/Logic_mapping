import axios from "axios";
import Papa from "papaparse";
import Login from "./login.spec";

// Hàm đọc dữ liệu từ Google Sheets
async function readOrdersFromSheet() {

  const url =
    "https://docs.google.com/spreadsheets/d/1qumJRzHPLbeMtvQA0W1VMBYXWQY3HpHUe2v6BeXMgo0/export?format=csv&gid=1009771488#gid=1009771488";
  const res = await axios.get(url);
  const data = Papa.parse(res.data, { header: true }).data; // header: true để dùng tên cột

  // Lấy các cột cần
  const selectedCols = data.map((row) => ({
    "Design Front": row["Design Front"],
    "Design Back": row["Design Back"],
    "Design Sleeves": row["Design Sleeves"],
    "Design Hood": row["Design Hood"],
    "Product Type": row["Product Type"],
    Size: row["Size"],
    Color: row["Color"],
  }));

  // console.log(selectedCols);
  return selectedCols;
}

// Hàm gọi API để lấy dữ liệu printing files
async function callPrintingFilesAPI(orderNumbers, page) {
  await Login()
  const url =
    "https://fulfillment-staging.merchize.com/api/order/printing-files/search";

  const payload = {
    order_number: orderNumbers,
    limit: 100,
    page: 1,
  };

  // const token_new = await page.evaluate(() =>
  //   localStorage.getItem("com.pdf126.accessToken").replace(/"/g, "")
  // );

  const token_new = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDMyNjgyN2U0YTA0YjBjZGZiMTAxYyIsInVzZXJuYW1lIjoibGluaG50azFAZm9vYmxhLmNvbSIsInJvbGVzIjpbeyJfaWQiOiI2NTgxMjE3OGI2ZjBiNzE0OGI4MmIwZjMiLCJuYW1lIjoiZmZtX2FkbWluIn0seyJfaWQiOiI2NThhNTI2M2Q0NDkwMDA0ZmVjNDkyOGEiLCJuYW1lIjoiZmFjX2FkbWluIn1dLCJpc19hZG1pbiI6ZmFsc2UsImRlcGFydG1lbnQiOnsiX2lkIjoiNjU3YTdjMGMwNzgwMjI5YTJjOWMwY2Q0Iiwia2V5IjoiRkZNIiwibmFtZSI6IkZ1bGZpbGxtZW50IiwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMTRUMDM6NTI6NDQuNjIwWiIsInVwZGF0ZWRfYXQiOiIyMDIzLTEyLTE0VDAzOjUyOjQ0LjYyMFoiLCJfX3YiOjB9LCJwZXJtaXNzaW9ucyI6eyJmYWNfcmVxdWVzdF91cGRhdGUiOiJSZXF1ZXN0IHVwZGF0ZSIsImZhY19wZXJtaXNzaW9uX21hbmFnZW1lbnQiOiJQZXJtaXNzaW9uIG1hbmFnZW1lbnQiLCJmYWNfdXNlcl9tYW5hZ2VtZW50IjoiVXNlciBtYW5hZ2VtZW50IiwiZmFjX3JvbGVfbWFuYWdlbWVudCI6IlJvbGUgbWFuYWdlbWVudCIsImZhY191c2VyX2FjdGlvbl9tYW5hZ2VtZW50IjoiVXNlciBhY3Rpb24gbWFuYWdlbWVudCIsImZhY19iYXNlX2Nvc3RfbWFuYWdlbWVudCI6IkZBQyBiYXNlIGNvc3QgbWFuYWdlbWVudCIsImZhY19iYXRjaF9zaGlwIjoiQmF0Y2ggc2hpcCIsImZhY19jcmVhdGVfYnJhbmQiOiJjcmVhdGUgYnJhbmQiLCJmYWNfdXBkYXRlX2JyYW5kIjoidXBkYXRlIGJyYW5kIiwiZmFjX2dldF9icmFuZF90YWciOiJnZXQgYnJhbmQgdGFnIiwiZmZtX2lzc3VlX2xpc3QiOiJGRk0gdmlldyBpc3N1ZSBsaXN0IiwiYmFzZV9jb3N0X21hbmFnZW1lbnQiOiJGQUMgYmFzZSBjb3N0IG1hbmFnZW1lbnQiLCJiYXRjaF9ydWxlX21hbmFnZW1lbnQiOiJNYW5hZ2UgYXV0byBjcmVhdGUgYmF0Y2ggcnVsZXMiLCJmZm1fdXBkYXRlX3Bob3RvX3JlcXVlc3QiOiJGRk0gVXBkYXRlIFBob3RvIFJlcXVlc3QifSwiaWF0IjoxNzU1MDQ5NjIyLCJleHAiOjE3NTc2NDE2MjJ9.RDibgBo4rM0skAtBaq6Ck274g-Rl-4yY2bIjrWzbrfA"
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token_new}`, 
  };

  try {
    const res = await axios.post(url, payload, { headers });
    console.log("Kết quả API:", res.data);
  } catch (err) {
    console.error("Lỗi:", err.response?.data || err.message);
  }
}

// Ví dụ truyền list orderNumber tùy ý
const customOrderNumbers = [
  "RJ-86446-72697",
  "RZ-48352-53228",
  "RN-27485-65833",
];

callPrintingFilesAPI(customOrderNumbers, page);

export {
  readOrdersFromSheet,
  callPrintingFilesAPI
}
