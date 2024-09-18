const { chromium } = require('playwright');

describe('Login Flow', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should navigate to the login page, enter mobile number, send OTP, and log in', async () => {
    // Navigate to the login page

    // Navigate to the login page
    await page.goto('http://localhost:3000/login');

    // Enter mobile number
    await page.fill('.inspacco-login  input.mobile-number', '7700000007'); // Replace with the actual selector and mobile number

    // Click on "Send OTP" button
    await page.click('.inspacco-login  button.send-otp'); // Replace with the actual selector

    // Wait for OTP input field to appear (adjust selector and timeout as needed)
    await page.waitForSelector('.otp-verify', { timeout: 5000 });

    // Enter OTP
    const otp = '2021';
    await page.fill('.otp-verify input:nth-child(1)', otp[0]); // Replace with the actual selector for the first OTP input field
    await page.fill('.otp-verify input:nth-child(2)', otp[1]); // Replace with the actual selector for the second OTP input field
    await page.fill('.otp-verify input:nth-child(3)', otp[2]); // Replace with the actual selector for the third OTP input field
    await page.fill('.otp-verify input:nth-child(4)', otp[3]); // Replace with the actual selector for the fourth OTP input field


    // Click on the login button
    await page.click('.otp-verify button.login-btn'); // Replace with the actual selector

    // Wait for a selector on the next page to confirm successful login (adjust selector as needed)
    await page.waitForSelector('div.navbar', { timeout: 5000 });

     // Click on the login button
     await page.click('div.navbar div.dropdown label.user-profile-icon'); // Replace with the actual selector
     const mobileNumber = await page.textContent('div.navbar div.dropdown a p.mobile-number-text')
    expect(mobileNumber).toBe('7700000007'); // Adjust the text and selector as necessary
  });
});
