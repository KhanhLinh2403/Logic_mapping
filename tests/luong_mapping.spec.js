// playwright script
import { test, expect } from "@playwright/test";

test.only("Xử lý đơn hàng với các thao tác đã cho", async ({ page }) => {
  // --- Đăng nhập ---
  await page.goto("https://fulfillment-staging.merchize.com/login");

  await page.fill('input[name="username"]', "linhntk1@foobla.com");
  await page.fill('input[name="password"]', "Abcd@1234");

  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]'),
  ]);

  // --- Tìm kiếm order ---
  await page.fill(
    'input.ant-input[placeholder="Type to search..."]',
    "RN-35346-98685"
  );
  await page.keyboard.press("Enter");

  // Chờ kết quả hiển thị và click vào order đầu tiên
  await page.click('//tbody/tr[1]/td[contains(@class, "OrderCode")]/a[1]');

  // Chờ nút 'Select product' xuất hiện
  await page.waitForSelector("//button[text()='Select product']");

  // --- Gán biến cho tất cả nút Select product ---
  const items = page.locator("//button[text()='Select product']");
  const count = await items.count();
  console.log("số button product", count);

  for (let i = 0; i < count; i++) {
    const item = items.nth(i);

    // Click "Select product"
    await item.click();

    // Search sản phẩm theo title
    await page.fill(
      'input.ant-input[placeholder="Search for title..."]',
      "GRADUA_STOLE_03"
    );
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000)
    // Chờ sản phẩm load và click vào item đầu tiên
    await page.waitForSelector(
      '//div[@class="ProductLineItems"]//div[contains(@class, "ProductLineItem")][1]'
    );
    await page.click(
      '//div[@class="ProductLineItems"]//div[contains(@class, "ProductLineItem")][1]'
    );

    // Chọn size thứ 2 trong bảng
    await page.click('//div[@class="ProductLineVariants"]/table/tbody/tr[2]');
  }

  // --- Click button tách pack ---
  await page.click("//div[contains(@class, 'OrderActions')]//a");

  // Chờ pack đầu tiên và các item trong pack xuất hiện
  await page.waitForSelector(
    "(//div[contains(@class, 'split-package__body')])[1]//div[@class='split-package__order-item']"
  );

  // --- Count số item trong pack đầu tiên ---
  const total_item = await page
    .locator(
      "(//div[contains(@class, 'split-package__body')])[1]//div[@class='split-package__order-item']"
    )
    .count();
  console.log("tổng số item trong pack", total_item);

  // --- Nếu số item > 1 => Add package và kéo thả ---
  if (total_item > 1) {
    // Tạo thêm pack và kéo từng item vào từng pack
    for (let i = 1; i < total_item; i++) {
      // Click "Add new a package"
      const addButton = page.locator(
        '//div[contains(@class, "split-package__footer")]//button[.//span[text()="Add new a package"]]'
      );
      await addButton.waitFor({ state: "visible" });
      await addButton.click();

      // Đợi pack mới xuất hiện
      const newPack = page.locator(
        `(//div[contains(@class, 'split-package__body')])[${i + 1}]`
      );
      await newPack.waitFor({ state: "visible" });

      // Xác định source và target
      const source = page.locator(
        `(//div[contains(@class, 'split-package__body')])[1]//div[@class='ant-spin-container']/div[${i + 1
        }]`
      );
      const target = newPack;

      // Chờ cả source và target xuất hiện
      await source.waitFor({ state: "visible" });
      await target.waitFor({ state: "visible" });

      // Thực hiện kéo thả với xử lý lỗi
      try {
        await source.dragTo(target);
      } catch (error) {
        console.error(`Drag item ${i + 1} failed:`, error);
      }
    }

    // Đếm số pack hiện có
    const total_pack = await page
      .locator(
        '//div[@class="ant-spin-container"]//div[@class="split-package__item"]'
      )
      .count();
    console.log("Tổng số pack", total_pack);

    // Chọn random supplier cho từng pack
    for (let i = 0; i < total_pack; i++) {
      const supplierDropdown = page.locator(
        `(//div[@class="split-package__supplier"]//div[contains(@class, "split-package__supplier-select") and not(contains(@class, "split-package__supplier-is-carrier"))])[${i + 1
        }]`
      );
      await supplierDropdown.click();

      const options = await page.$$(
        '//div[contains(@class, "rc-virtual-list-holder-inner")]//div[contains(@class, "ant-select-item-option")]'
      );
      if (options.length > 0) {
        const randomIndex = Math.floor(Math.random() * options.length);
        await options[randomIndex].click();
      }
    }

    // Click "Mark packages to processing"
    await page.click(
      '//div[contains(@class, "split-package__footer")]/button[2]'
    );

    // --- Push all package ---
    await page.click("//div[@class='SectionInner']//button[contains(text(), 'Push all package')]");

  } else {
    // Trường hợp chỉ có 1 item → xử lý "Ngược lại"
    const supplierSelect = page.locator('//div[@class="split-package__supplier"]//div[contains(@class, "split-package__supplier-select")]');
    await supplierSelect.first().click();

    // Chọn option số 5
    const fixedOption = page.locator(
      '(//div[contains(@class, "rc-virtual-list-holder-inner")]//div[contains(@class, "ant-select-item-option")])[1]'
    );
    await fixedOption.click();
    await page.waitForTimeout(1000)

    // Click "Mark packages to processing"
    await page.click(
      '//div[contains(@class, "split-package__footer")]/button[2]'
    );

    // const token = await page.evaluate(() => localStorage.getItem("com.pdf126.accessToken"));
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDMyNjgyN2U0YTA0YjBjZGZiMTAxYyIsInVzZXJuYW1lIjoibGluaG50azFAZm9vYmxhLmNvbSIsInJvbGVzIjpbeyJfaWQiOiI2NTgxMjE3OGI2ZjBiNzE0OGI4MmIwZjMiLCJuYW1lIjoiZmZtX2FkbWluIn0seyJfaWQiOiI2NThhNTI2M2Q0NDkwMDA0ZmVjNDkyOGEiLCJuYW1lIjoiZmFjX2FkbWluIn1dLCJpc19hZG1pbiI6ZmFsc2UsImRlcGFydG1lbnQiOnsiX2lkIjoiNjU3YTdjMGMwNzgwMjI5YTJjOWMwY2Q0Iiwia2V5IjoiRkZNIiwibmFtZSI6IkZ1bGZpbGxtZW50IiwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMTRUMDM6NTI6NDQuNjIwWiIsInVwZGF0ZWRfYXQiOiIyMDIzLTEyLTE0VDAzOjUyOjQ0LjYyMFoiLCJfX3YiOjB9LCJwZXJtaXNzaW9ucyI6eyJmYWNfcmVxdWVzdF91cGRhdGUiOiJSZXF1ZXN0IHVwZGF0ZSIsImZhY19wZXJtaXNzaW9uX21hbmFnZW1lbnQiOiJQZXJtaXNzaW9uIG1hbmFnZW1lbnQiLCJmYWNfdXNlcl9tYW5hZ2VtZW50IjoiVXNlciBtYW5hZ2VtZW50IiwiZmFjX3JvbGVfbWFuYWdlbWVudCI6IlJvbGUgbWFuYWdlbWVudCIsImZhY191c2VyX2FjdGlvbl9tYW5hZ2VtZW50IjoiVXNlciBhY3Rpb24gbWFuYWdlbWVudCIsImZhY19iYXNlX2Nvc3RfbWFuYWdlbWVudCI6IkZBQyBiYXNlIGNvc3QgbWFuYWdlbWVudCIsImZhY19iYXRjaF9zaGlwIjoiQmF0Y2ggc2hpcCIsImZhY19jcmVhdGVfYnJhbmQiOiJjcmVhdGUgYnJhbmQiLCJmYWNfdXBkYXRlX2JyYW5kIjoidXBkYXRlIGJyYW5kIiwiZmFjX2dldF9icmFuZF90YWciOiJnZXQgYnJhbmQgdGFnIiwiZmZtX2lzc3VlX2xpc3QiOiJGRk0gdmlldyBpc3N1ZSBsaXN0IiwiYmFzZV9jb3N0X21hbmFnZW1lbnQiOiJGQUMgYmFzZSBjb3N0IG1hbmFnZW1lbnQiLCJiYXRjaF9ydWxlX21hbmFnZW1lbnQiOiJNYW5hZ2UgYXV0byBjcmVhdGUgYmF0Y2ggcnVsZXMiLCJmZm1fdXBkYXRlX3Bob3RvX3JlcXVlc3QiOiJGRk0gVXBkYXRlIFBob3RvIFJlcXVlc3QifSwiaWF0IjoxNzU0NjIyNzM1LCJleHAiOjE3NTcyMTQ3MzV9.g3LSGpHgFM8pECobyIrgSFkA4u35nl-MRnFRONLumeg"
    const domain = "https://fulfillment-staging.merchize.com"; // thay nếu cần

    // --- Gọi API cập nhật status review -> done ---
    // const res = await page.request.get(`${domain}/api/order/printing-files/search`);
    const res = await page.request.post(
      `${domain}/api/order/printing-files/search`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          order_number: "RN-35346-98685",
        },
      }
    );
    const responseData = await res.json();
    console.log(responseData)
    const statusList = ["review", "done"];

    for (const item of responseData.data.items) {
      for (const stt of statusList) {
        const updateRes = await page.request.put(
          `${domain}/api/order/printing-files/${item.fulfillment}/items/${item._id}/status/${stt}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(
          `Updated ${item._id} (${item.fulfillment}) to ${stt} -> ${updateRes.status()}`
        );
      }
    }

    // Push đến xưởng
    await page.click('//div[@class="pushTo1C"]//button');
  }
});
