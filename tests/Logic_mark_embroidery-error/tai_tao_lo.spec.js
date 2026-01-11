// playwright script
import { test, expect } from "@playwright/test";
import { embroideryErrorPage } from "../list_xpath";

test.only("Logic đánh dấu lỗi thêu", async ({ page }) => {
  await page.goto("https://tool3d-staging.merchize.com/login");

  // Điền thông tin đăng nhập
  await page.fill('input[name="username"]', "god@foobla.com");
  await page.fill('input[name="password"]', "Abcd@1234");

  // Nhấn nút Sign in
  await page.click('button[type="submit"]');

  await page.waitForTimeout(5000);
  await page.click(embroideryErrorPage.menuEmbroideryError);
  await page.click(embroideryErrorPage.filterDateRange);
  await page.click(embroideryErrorPage.todayButton);

  await page.waitForTimeout(5000);

  await page.click(embroideryErrorPage.selectAllCheckbox);
  await page.click(embroideryErrorPage.thaoTacButton);
  await page.click(embroideryErrorPage.taiTaoLoButton);

  await page.waitForTimeout(5000);

  await page.fill(embroideryErrorPage.inputNguoiTaiTaoLo, "Linh");
  await page.click(embroideryErrorPage.chonDoiTacDropdown);
  const options = page.locator(embroideryErrorPage.chonDoiTacDropdown);
  const count = await options.count();

  // Random index trong khoảng [0, count-1]
  const randomIndex = Math.floor(Math.random() * count);

  // Click option random
  await options.nth(randomIndex).click();

  console.log("Đã chọn option index:", randomIndex);
  await page.click(embroideryErrorPage.chonOptionDoiTac);
  await page.click(embroideryErrorPage.confirmTaiTaoButton);

  //   await page.click(
  //     "//div[contains(@class, 'brand')]//div[contains(@class, 'ant-select-selection')]"
  //   );
  //   await page.click("//li[@role='option' and contains(., 'UID')]");
});
