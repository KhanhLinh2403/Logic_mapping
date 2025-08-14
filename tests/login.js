import { test, expect } from '@playwright/test';

const Login = async (page) => {
    await page.goto('https://fulfillment-staging.merchize.com/login');

    // Điền thông tin đăng nhập
    await page.fill('input[name="username"]', 'linhntk1@foobla.com');
    await page.fill('input[name="password"]', 'Abcd@1234');

    // Nhấn nút Sign in
    await page.click('button[type="submit"]');

    await page.waitForTimeout(3000);

    // Kiểm tra nếu URL đã thay đổi (login thành công)
    await expect(page).not.toHaveURL('https://fulfillment-staging.merchize.com/login');
}

export default Login;

