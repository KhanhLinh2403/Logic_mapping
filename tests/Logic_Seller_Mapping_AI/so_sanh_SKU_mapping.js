import { test } from "@playwright/test";
import axios from "axios";
import { readOrdersFromSheet } from "./readcsv_list_product.js";

const API_URL = "https://fulfillment-staging.merchize.com/api/v1/map-end-to-end-pipeline";

test("So sánh SKU trong sheet với response API", async () => {
  const rows = await readOrdersFromSheet();

  for (const [index, row] of rows.entries()) {
    const payload = {
      product_title: row.product_title,
      variant: row.variant,
      mockup_img: row.mockup_img,
      store: row.store,
      user_text: "",
      artwork_imgs: row.artwork_imgs ? row.artwork_imgs.split(",") : [],
      dimensions: row.dimensions,
      list_ids: [""],
      threshold: 0.8,
    };

    try {
      const res = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const response = res.data;

      // Lấy SKU từ sheet
      const sheetSku = row["sku_catalog_mapping"];

      // Lấy SKU từ response
      const { product_sku} = response;

      // So sánh
      if (sheetSku === product_sku ) {
        console.log(`✅ Row ${index + 1}: PASS | sheetSku=${sheetSku}, response=[${product_sku}]`);
      } else {
        console.log(`❌ Row ${index + 1}: FAIL | sheetSku=${sheetSku}, response=[${product_sku}]`);
      }

    } catch (err) {
      console.error(`⚠️ Lỗi Row ${index + 1}:`, err.response?.data || err.message);
    }
  }
});
