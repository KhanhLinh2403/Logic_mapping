import axios from "axios";
import Papa from "papaparse";
import Login from "./login.js";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1qumJRzHPLbeMtvQA0W1VMBYXWQY3HpHUe2v6BeXMgo0/export?format=csv&gid=1009771488";
const API_BASE = "https://fulfillment-staging.merchize.com/api/order";

// Đọc dữ liệu từ Google Sheets
async function readOrdersFromSheet() {
  try {
    const res = await axios.get(SHEET_URL);
    const data = Papa.parse(res.data, { header: true }).data; // header: true để dùng tên cột

    return data.map((row) => ({
      front: row["Design Front"],
      back: row["Design Back"],
      sleeves: row["Design Sleeves"],
      hood: row["Design Hood"],
      type: row["Product Type"],
      size: row["Size"],
      color: row["Color"],
    }));
  } catch (err) {
    console.error("Lỗi đọc Google Sheets:", err.message);
    return [];
  }
}

async function getToken(page) {
  return page.evaluate(
    () => localStorage.getItem("com.pdf126.accessToken")?.replace(/"/g, "")
  );
}

// Hàm gọi API search
async function searchFFMItem(orderNumbers, headers) {
  const urlSearch = `${API_BASE}/printing-files/search`;
  const payloadSearch = {
    order_number: orderNumbers, 
    limit: 100, 
    page: 1 
  };
  const res = await axios.post(urlSearch, payloadSearch, { headers });
  return res.data?.data?.items || [];
}

async function updateDesign(ffm_itemId, payloadUpdate, headers) {
  const urlUpdate = `${API_BASE}/fulfillment-items/printing-files/${ffm_itemId}/designs`;
  return axios.post(urlUpdate, payloadUpdate, { headers });
}

async function callSearchAndUpdate(orderNumbers, page, dataRead) {
  await Login(page);

  const token = await getToken(page);
  if (!token) throw new Error("Không lấy được token");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  try {
    const items = await searchFFMItem(orderNumbers, headers);
  
    // map từ Google Sheet ra luôn object có key front, back, hood, sleeves, type, size, color.
    // Dùng Promise.all để xử lý đồng thời các cập nhật (nhanh hơn dùng for loop)
    await Promise.all(
      items.map((item, i) =>
        updateDesign(item._id, dataRead[i], headers)
          .then(() => console.log(`Cập nhật thành công order ${item._id}`))
          .catch((err) =>
            console.error(`Lỗi cập nhật ${item._id}:`, err.response?.data || err.message)
          )
      )
    );
    
  } catch (err) {
    console.error("Lỗi khi search hoặc update:", err.message);
  }
}

  // try {
  //   const items = await searchFFMItem(orderNumbers, headers);
    
  //   await Promise.all(
  //     items.map((item, i) => {
  //       const payloadUpdate = {
  //         "front": dataRead[i].Design_Front,
  //         "back": dataRead[i].Design_Back,
  //         "hood": dataRead[i].Design_Hood,
  //         "sleeves": dataRead[i].Design_Sleeves,
  //         "type": dataRead[i].Product_Type,
  //         "size": dataRead[i].Size,
  //         "color": dataRead[i].Color,
  //       };

  //       return updateDesign(item._id, payloadUpdate, headers)
  //         .then(() => console.log(`Cập nhật thành công order ${item._id}`))
  //         .catch((err) =>
  //           console.error(`Lỗi cập nhật ${item._id}:`, err.response?.data || err.message)
  //         );
  //     })
  //   );
    
  // } catch (err) {
  //   console.error("Lỗi khi search hoặc update:", err.message);
  // }
  
export { readOrdersFromSheet, callSearchAndUpdate };
