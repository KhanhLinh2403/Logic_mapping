import axios from "axios";
import Papa from "papaparse";
import Login from "./login.js";
import { log } from "console";

// Hàm đọc dữ liệu từ Google Sheets
async function readOrdersFromSheet() {

  const url =
    "https://docs.google.com/spreadsheets/d/1qumJRzHPLbeMtvQA0W1VMBYXWQY3HpHUe2v6BeXMgo0/export?format=csv&gid=1009771488#gid=1009771488";
  const res = await axios.get(url);
  const data = Papa.parse(res.data, { header: true }).data; // header: true để dùng tên cột

  // Lấy các cột cần
  const selectedCols = data.map((row) => ({
    "Design_Front": row["Design Front"],
    "Design_Back": row["Design Back"],
    "Design_Sleeves": row["Design Sleeves"],
    "Design_Hood": row["Design Hood"],
    "Product_Type": row["Product Type"],
    "Size": row["Size"],
    "Color": row["Color"],
  }));

  // console.log(selectedCols);
  return selectedCols;
}

// Hàm gọi API để lấy dữ liệu printing files
async function callSearchAndUpdate(orderNumbers, page, dataRead) {

  await Login(page)
  const apiSearch =
    "https://fulfillment-staging.merchize.com/api/order/printing-files/search";

  const payloadSearch = {
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

  const res = await axios.post(apiSearch, payloadSearch, { headers });

  const listOrderNumber = res.data.data.items;

  for (let i = 0; i < listOrderNumber.length; i++) {
    const apiUpdateDesign =
      `https://fulfillment-staging.merchize.com/api/order/fulfillment-items/printing-files/${listOrderNumber[i]._id}/designs`;

    const payloadUpdate = {
      "front": dataRead[i].Design_Front,
      "back": dataRead[i].Design_Back,
      "hood": dataRead[i].Design_Hood,
      "sleeves": dataRead[i].Design_Sleeves,
      "type": dataRead[i].Product_Type,
      "size": dataRead[i].Size,
      "color": dataRead[i].Color
    };
    console.log(1222, listOrderNumber[i]._id, apiUpdateDesign);
    
    try {
      const resUpdateDesign = await axios.post(apiUpdateDesign, payloadUpdate, { headers });
      log(resUpdateDesign)
    } catch (err) {
      console.error("Lỗi:", err.response?.data || err.message);
    }

  }

}

export {
  readOrdersFromSheet,
  callSearchAndUpdate
}
