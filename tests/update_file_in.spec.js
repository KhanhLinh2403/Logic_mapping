import { test, expect } from "@playwright/test";
import axios from "axios";
import Papa from "papaparse";

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

  console.log(selectedCols);
  return selectedCols;
}

// Hàm gọi API để lấy dữ liệu printing files
async function callPrintingFilesAPI(orderNumbers) {
  const url =
    "https://fulfillment-staging.merchize.com/api/order/printing-files/search";

  const payload = {
    order_number: orderNumbers,
    limit: 100,
    page: 1,
  };
  const token_new = await page.evaluate(() =>
    localStorage.getItem("com.pdf126.accessToken").replace(/"/g, "")
  );
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
  "RB-22856-95283-F1",
  "RD-36446-37493-F1",
  "RM-95352-52677-F1",
];

callPrintingFilesAPI(customOrderNumbers);
