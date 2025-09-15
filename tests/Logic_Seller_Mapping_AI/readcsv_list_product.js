import axios from "axios";
import Papa from "papaparse";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1fWVp60Zva4TTuALXm8rNQMJWWLPMGOljqHfqzfc4Br0/export?format=csv&gid=0";

// Đọc dữ liệu từ Google Sheets
async function readOrdersFromSheet() {
  try {
    const res = await axios.get(SHEET_URL);
    const data = Papa.parse(res.data, { header: true }).data;

    return data.map((row, index) => {
      const product = {
        product_title: row["product title"],
        variant: row["variant"],
        mockup_img: row["mockup_img"],
        store: row["store"],
        artwork_imgs: row["artwork_imgs"],
        dimensions: row["dimensions"],
        sku_catalog_mapping: row["SKU catalog mapping"],
      };

      // log ra từng dòng
      console.log(`Row ${index + 1}:`, product);

      return product;
    });
  } catch (err) {
    console.error("Lỗi đọc Google Sheets:", err.message);
    return [];
  }
}

(async () => {
  const data = await readOrdersFromSheet();
  console.log("Tổng số dòng đọc được:", data.length);
})();


export { readOrdersFromSheet };
