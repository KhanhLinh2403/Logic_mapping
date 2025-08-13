import { test, expect } from '@playwright/test';

test.describe('Login page', () => {

    test('Login successfully', async ({ page }) => {
        await page.goto('https://fulfillment-staging.merchize.com/login');

        // Điền thông tin đăng nhập
        await page.fill('input[name="username"]', 'nganq1_facus');
        await page.fill('input[name="password"]', 'Abcd@1234');

        // Nhấn nút Sign in
        await page.click('button[type="submit"]');

        await page.waitForTimeout(3000); 

        // Kiểm tra nếu URL đã thay đổi (login thành công)
        await expect(page).not.toHaveURL('https://fulfillment-staging.merchize.com/login');
    });

});
