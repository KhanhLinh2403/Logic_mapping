// playwright script
import { test, expect } from "@playwright/test";
import markDonePrintFIle from "../helper/mark_done_print_file";
import dragSlow from "../helper/dragSlow";

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
  // await page.fill(
  //   'input.ant-input[placeholder="Type to search..."]',
  //   "RG-75694-32499"
  // );
  // await page.keyboard.press("Enter");

  // Click vào phần tử Unfulfilled
  await page.click("//div[@class='ant-radio-group ant-radio-group-solid']//span[text()='Unfulfilled']");

  await page.waitForTimeout(1000)
  // Chờ kết quả hiển thị và click vào order đầu tiên
  await page.click('//tbody/tr[1]/td[contains(@class, "OrderCode")]/a[1]');

  // Lưu ordernumber vừa click
  const orderNumber = (await page.textContent('//h1[contains(@class, "PageTitle") and contains(@class, "OrderNumber")]')).replace('#', '');

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
    let sourceDragSuccess = 0
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

      await page.waitForTimeout(1000);

      // Đếm số pack hiện có
      const total_pack = await page
        .locator(
          '//div[@class="ant-spin-container"]//div[@class="split-package__item"]'
        )
        .count();
      console.log("Tổng số pack", total_pack);

      // Chọn supplier cho từng pack (dropdown Ant Design gắn vào body → cần scope theo dropdown đang mở)
      for (let i = 0; i < total_pack; i++) {
        const supplierDropdown = page.locator(
          `(//div[@class="split-package__supplier"]//div[contains(@class, "split-package__supplier-select") and not(contains(@class, "split-package__supplier-is-carrier"))])[${i + 1}]`
        );
        await supplierDropdown.scrollIntoViewIfNeeded();
        await supplierDropdown.click();

        // Chờ dropdown hiển thị và chỉ lấy options trong dropdown đang mở
        const visibleDropdown = page
          .locator("//div[contains(@class, 'ant-select-dropdown') and not(contains(@class,'ant-select-dropdown-hidden'))]")
          .last();
        await visibleDropdown.waitFor({ state: "visible" });

        const visibleOptions = visibleDropdown.locator(
          ".ant-select-item-option"
        );
        const optionCount = await visibleOptions.count();
        expect(optionCount).toBeGreaterThan(0);
        await visibleOptions.nth(0).click();
        await page.waitForTimeout(200);
      }

      // Xác định source và target
      const source = page.locator(
        `(//div[contains(@class, 'split-package__body')])[1]//div[@class='ant-spin-container']/div[${i + 1 - sourceDragSuccess}]`
      );
      const target = newPack;

      // Chờ cả source và target xuất hiện
      await source.waitFor({ state: "visible" });
      await target.waitFor({ state: "visible" });

      // Thực hiện kéo thả với xử lý lỗi
      await page.pause();
      try {
        await dragSlow(page, source, target, {
          hold: 90,
          steps: 5,
          stepDelay: 8,
          preJitter: 8,
          jitterDown: true,
        });
        sourceDragSuccess++;
        console.log(`Drag item ${i + 1} thành công`);
      } catch (error) {
        console.error(`Drag item ${i + 1} failed:`, error);
      }
    }

    await page.waitForTimeout(1000)

    // Click "Mark packages to processing"
    await page.click(
      '//div[contains(@class, "split-package__footer")]/button[2]'
    );
    
    await markDonePrintFIle(orderNumber, page)

    // --- Push all package ---
    await page.click("//div[@class='SectionInner']//button[contains(text(), 'Push all package')]");
    await page.waitForTimeout(2000)
    await page.click('//div[contains(@class, "ant-modal-footer")]//button[contains(@class, "ant-btn-primary") and span[text()="OK"]]');

  } else {
    // Trường hợp chỉ có 1 item → xử lý "Ngược lại"
    const supplierSelect = page.locator('//div[@class="split-package__supplier"]//div[contains(@class, "split-package__supplier-select")]');
    await supplierSelect.first().click();

    // Chọn option số 1
    const fixedOption = page.locator(
      '(//div[contains(@class, "rc-virtual-list-holder-inner")]//div[contains(@class, "ant-select-item-option")])[1]'
    );
    await fixedOption.click();
    await page.waitForTimeout(1000)

    // Click "Mark packages to processing"
    await page.click(
      '//div[contains(@class, "split-package__footer")]/button[2]'
    );

    await markDonePrintFIle(orderNumber, page)

    // Push đến xưởng
    await page.click('//div[@class="pushTo1C"]//button[contains(text(), "Push")]');
    await page.waitForTimeout(2000)
    await page.click('//div[contains(@class, "footer-button")]//button[contains(text(), "Push")]');
  }
});
