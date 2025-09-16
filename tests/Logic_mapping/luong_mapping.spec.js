import { test, expect } from "@playwright/test";
import markDonePrintFIle from "../../helper/mark_done_print_file";
import dragSlow from "../../helper/dragSlow";
import login from "../login";
import { orderMapping } from "../list_xpath";

test.only("Xử lý đơn hàng với các thao tác đã cho", async ({ page }) => {
  await login(page);

  await page.click(orderMapping.unfulfilledTab);
  await page.click(orderMapping.filterUS);

  await page.waitForTimeout(1000);
  await page.click(orderMapping.firstOrderLink);

  const orderNumber = (await page.textContent(orderMapping.orderNumberTitle)).replace("#", "");
  await page.waitForSelector(orderMapping.selectProductBtn);

  const items = page.locator(orderMapping.selectProductBtn);
  const count = await items.count();
  console.log("số button product", count);

  for (let i = 0; i < count; i++) {
    const item = items.nth(i);
    await item.click();

    await page.fill(orderMapping.searchProductInput, "GRADUA_STOLE_03");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);

    await page.waitForSelector(orderMapping.firstProductItem);
    await page.click(orderMapping.firstProductItem);
    await page.click(orderMapping.secondSizeRow);
  }

  await page.click(orderMapping.splitPackageBtn);
  await page.waitForSelector(orderMapping.firstPackItems);

  const total_item = await page.locator(orderMapping.firstPackItems).count();
  console.log("tổng số item trong pack", total_item);

  if (total_item > 1) {
    let sourceDragSuccess = 0;
    for (let i = 1; i < total_item; i++) {
      const addButton = page.locator(orderMapping.addNewPackageBtn);
      await addButton.waitFor({ state: "visible" });
      await addButton.click();

      const newPack = page.locator(orderMapping.splitPackageBody(i + 1));
      await newPack.waitFor({ state: "visible" });

      await page.waitForTimeout(1000);

      const total_pack = await page.locator('//div[@class="ant-spin-container"]//div[@class="split-package__item"]').count();
      console.log("Tổng số pack", total_pack);

      for (let j = 0; j < total_pack; j++) {
        const supplierDropdown = page.locator(orderMapping.supplierDropdown(j + 1));
        await supplierDropdown.scrollIntoViewIfNeeded();
        await supplierDropdown.click();

        const visibleDropdown = page.locator(orderMapping.visibleDropdown).last();
        await visibleDropdown.waitFor({ state: "visible" });

        const visibleOptions = visibleDropdown.locator(orderMapping.dropdownOption);
        const optionCount = await visibleOptions.count();
        expect(optionCount).toBeGreaterThan(0);
        await visibleOptions.nth(0).click();
        await page.waitForTimeout(200);
      }

      const source = page.locator(
        `(//div[contains(@class, 'split-package__body')])[1]//div[@class='ant-spin-container']/div[${i + 1 - sourceDragSuccess}]`
      );
      const target = newPack;

      await source.waitFor({ state: "visible" });
      await target.waitFor({ state: "visible" });

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

    await page.waitForTimeout(1000);

    await page.click(orderMapping.markProcessingBtn);
    await markDonePrintFIle(orderNumber, page);

    await page.click(orderMapping.pushAllBtn);
    await page.waitForTimeout(2000);
    await page.click(orderMapping.pushAllConfirmBtn);
  } else {
    const supplierSelect = page.locator(orderMapping.supplierSelect);
    await supplierSelect.first().click();
    await page.click(orderMapping.supplierFirstOption);

    await page.waitForTimeout(1000);
    await page.click(orderMapping.markProcessingBtn);

    await markDonePrintFIle(orderNumber, page);

    await page.click(orderMapping.pushSingleBtn);
    await page.waitForTimeout(2000);
    await page.click(orderMapping.pushSingleConfirmBtn);
  }
});
