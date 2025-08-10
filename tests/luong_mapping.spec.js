// playwright script
import { test, expect } from '@playwright/test';

test.only('Xử lý đơn hàng với các thao tác đã cho', async ({ page }) => {

  // --- Đăng nhập ---
  await page.goto('https://fulfillment-staging.merchize.com/login');

  await page.fill('input[name="username"]', 'linhntk1@foobla.com');
  await page.fill('input[name="password"]', 'Abcd@1234');

  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]')
  ]);

    // --- Tìm kiếm order ---
  await page.fill('input.ant-input[placeholder="Type to search..."]', 'RQ-27339-89796');
  await page.keyboard.press('Enter');

  // Chờ kết quả hiển thị và click vào order đầu tiên
  await page.click('//tbody/tr[1]/td[contains(@class, "OrderCode")]/a[1]');

  // Chờ nút 'Select product' xuất hiện
  await page.waitForSelector("//button[text()='Select product']");

  // --- Gán biến cho tất cả nút Select product ---
  const items = page.locator("//button[text()='Select product']");
  const count = await items.count();
  console.log("số button product", count)

  for (let i = 0; i < count; i++) {
  const item = items.nth(i);

  // Click "Select product"
  await item.click();

  // Search sản phẩm theo title
  await page.fill('input.ant-input[placeholder="Search for title..."]', 'GRADUA_STOLE_03');
  await page.keyboard.press('Enter');

  // Chờ sản phẩm load và click vào item đầu tiên
  await page.waitForSelector('//div[@class="ProductLineItems"]//div[contains(@class, "ProductLineItem")][1]');
  await page.click('//div[@class="ProductLineItems"]//div[contains(@class, "ProductLineItem")][1]');

  // Chọn size thứ 2 trong bảng
  await page.click('//div[@class="ProductLineVariants"]/table/tbody/tr[2]');
}


  // --- Click button tách pack ---
  await page.click("//div[contains(@class, 'OrderActions')]//a");

  // Chờ pack đầu tiên và các item trong pack xuất hiện
  await page.waitForSelector("(//div[contains(@class, 'split-package__body')])[1]//div[@class='split-package__order-item']");

  // --- Count số item trong pack đầu tiên ---
  const total_item = await page.locator("(//div[contains(@class, 'split-package__body')])[1]//div[@class='split-package__order-item']").count();
  console.log("tổng số item trong pack", total_item);

  // --- Nếu số item > 1 => Add package và kéo thả ---
  if (total_item > 1) {
  // Tạo thêm pack và kéo từng item vào từng pack
  for (let i = 1; i < total_item; i++) {
    // Click "Add new a package"
    const addButton = page.locator('//div[contains(@class, "split-package__footer")]//button[.//span[text()="Add new a package"]]');
    await addButton.click();
    await addButton.waitFor({ state: 'visible' });

    // Kéo item i+1 từ pack đầu sang pack thứ i+1
    const source = page.locator(`(//div[contains(@class, 'split-package__body')])[1]//div[@class='ant-spin-container']/div[${i + 1}]`);
    const target = page.locator(`(//div[contains(@class, 'split-package__body')])[${i + 1}]`);

    // Chờ cả source và target xuất hiện và hiển thị
    await source.waitFor({ state: 'visible' });
    await target.waitFor({ state: 'visible' });

    // Thực hiện kéo thả
    await source.dragTo(target);
  }

  // Đếm số pack hiện có
  const total_pack = await page.locator('//div[@class="ant-spin-container"]//div[@class="split-package__item"]').count();
  console.log("Tổng số pack", total_pack)

  // Chọn random supplier cho từng pack
  for (let i = 0; i < total_pack; i++) {
    const supplierDropdown = page.locator(`(//div[@class="split-package__supplier"]//div[contains(@class, "split-package__supplier-select") and not(contains(@class, "split-package__supplier-is-carrier"))])[${i + 1}]`);
    await supplierDropdown.click();

    const options = await page.$$('//div[contains(@class, "rc-virtual-list-holder-inner")]//div[contains(@class, "ant-select-item-option")]');
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      await options[randomIndex].click();
    }
  }

  // Click "Mark packages to processing"
  await page.click('//div[contains(@class, "split-package__footer")]/button[2]');

  // --- Push all package ---
  await page.click("//div[@class='SectionInner']//button[contains(text(), 'Push all package')]");

} else {
  // ✅ Trường hợp chỉ có 1 item → xử lý "Ngược lại"
  const supplierSelect = page.locator('//div[@class="split-package__supplier"]//div[contains(@class, "split-package__supplier-select")]');
  await supplierSelect.first().click();

  // Chọn option số 5
  const fixedOption = page.locator('(//div[contains(@class, "rc-virtual-list-holder-inner")]//div[contains(@class, "ant-select-item-option")])[5]');
  await fixedOption.click();

  // Click "Mark packages to processing"
  await page.click('//div[contains(@class, "split-package__footer")]/button[2]');

  // Push đến xưởng
  await page.click('//div[@class="pushTo1C"]//button');
}

});

