import { test, expect } from "@playwright/test";
import sharp from "sharp";

async function getImageContent(page, url) {
  const response = await page.request.get(url);
  const buffer = await response.body();
  
  // Sử dụng sharp để đọc thông tin ảnh
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  // Lấy dữ liệu pixel để so sánh nội dung
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  
  return {
    width: metadata.width,
    height: metadata.height,
    channels: metadata.channels,
    format: metadata.format,
    pixelData: data,
    buffer: buffer
  };
}

async function compareImageContent(image1, image2) {
  // So sánh kích thước ảnh
  if (image1.width !== image2.width || image1.height !== image2.height) {
    return {
      isSimilar: false,
      reason: `Kích thước khác nhau: ${image1.width}x${image1.height} vs ${image2.width}x${image2.height}`
    };
  }

  // So sánh số kênh màu
  if (image1.channels !== image2.channels) {
    return {
      isSimilar: false,
      reason: `Số kênh màu khác nhau: ${image1.channels} vs ${image2.channels}`
    };
  }

  // So sánh dữ liệu pixel
  const pixelData1 = image1.pixelData;
  const pixelData2 = image2.pixelData;
  
  if (pixelData1.length !== pixelData2.length) {
    return {
      isSimilar: false,
      reason: "Dữ liệu pixel có độ dài khác nhau"
    };
  }

  // So sánh từng pixel
  let differentPixels = 0;
  const tolerance = 5; // Cho phép sai lệch nhỏ trong màu sắc
  
  for (let i = 0; i < pixelData1.length; i++) {
    if (Math.abs(pixelData1[i] - pixelData2[i]) > tolerance) {
      differentPixels++;
    }
  }

  const similarityPercentage = ((pixelData1.length - differentPixels) / pixelData1.length) * 100;
  
  return {
    isSimilar: similarityPercentage >= 95, // 95% trở lên được coi là giống nhau
    similarityPercentage,
    differentPixels,
    totalPixels: pixelData1.length
  };
}

test("So sánh nội dung thực tế của 2 ảnh", async ({ page }) => {
  const url1 = "https://fulfillment-staging-new.s3.ap-southeast-1.amazonaws.com/2025-08-19/DTG2DTF/a69f7f97-fbff-474a-b4b2-589cd0b91ebd/RY-99259-76348-F1_1_front.png";
  const url2 = "https://d2g2orozxij1wh.cloudfront.net/2025-08-15/DTG2DTF/b0a86805-17c5-4b55-9022-ebf21f92f2ac/RV-25654-47728-F2_1_front.png";

  console.log("Đang tải và phân tích ảnh 1...");
  const image1 = await getImageContent(page, url1);
  
  console.log("Đang tải và phân tích ảnh 2...");
  const image2 = await getImageContent(page, url2);

  // In thông tin chi tiết về 2 ảnh
  console.log("Thông tin ảnh 1:");
  console.log(`- Kích thước: ${image1.width}x${image1.height}`);
  console.log(`- Định dạng: ${image1.format}`);
  console.log(`- Số kênh màu: ${image1.channels}`);

  console.log("Thông tin ảnh 2:");
  console.log(`- Kích thước: ${image2.width}x${image2.height}`);
  console.log(`- Định dạng: ${image2.format}`);
  console.log(`- Số kênh màu: ${image2.channels}`);

  // So sánh nội dung ảnh
  const comparison = await compareImageContent(image1, image2);
  
  console.log("Kết quả so sánh:");
  console.log(`- Độ tương đồng: ${comparison.similarityPercentage.toFixed(2)}%`);
  console.log(`- Số pixel khác biệt: ${comparison.differentPixels}/${comparison.totalPixels}`);
  
  if (comparison.isSimilar) {
    console.log("✅ Hai ảnh có nội dung tương tự nhau!");
    expect(comparison.similarityPercentage).toBeGreaterThanOrEqual(95);
  } else {
    console.log(`❌ Hai ảnh khác nhau: ${comparison.reason}`);
    expect(comparison.isSimilar).toBe(true);
  }
});