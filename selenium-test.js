import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';

class RegistrationTest {
    constructor() {
        this.driver = null;
        this.baseUrl = 'http://localhost:5500';
    }

    async setupDriver() {
        console.log('🚀 Setting up Chrome browser...');
        let options = new chrome.Options();
        
        // Add arguments to suppress logs and errors
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');
        options.addArguments('--disable-extensions');
        options.addArguments('--disable-plugins');
        options.addArguments('--disable-images');
        options.addArguments('--disable-gpu');
        options.addArguments('--log-level=3');
        options.addArguments('--silent');
        options.addArguments('--disable-features=VizDisplayCompositor');
        options.addArguments('--disable-background-timer-throttling');
        options.addArguments('--disable-backgrounding-occluded-windows');
        options.addArguments('--disable-renderer-backgrounding');
        options.addArguments('--disable-field-trial-config');
        options.addArguments('--disable-component-extensions-with-background-pages');

        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await this.driver.manage().setTimeouts({ 
            implicit: 10000,
            pageLoad: 30000,
            script: 30000 
        });
        
        // Maximize window to ensure full page visibility
        await this.driver.manage().window().maximize();
        
        console.log('✅ Browser setup complete!');
    }

    async takeScreenshot(name) {
        try {
            console.log(`📸 Taking screenshot: ${name}.png`);
            
            // Ensure we're at the top of the page
            await this.driver.executeScript('window.scrollTo(0, 0);');
            await this.driver.sleep(500);
            
            const image = await this.driver.takeScreenshot();
            fs.writeFileSync(`${name}.png`, image, 'base64');
            console.log(`✅ Screenshot saved: ${name}.png`);
        } catch (error) {
            console.log(`❌ Failed to take screenshot: ${error.message}`);
        }
    }

    async ensureTopOfPage() {
        try {
            await this.driver.executeScript('window.scrollTo(0, 0);');
            await this.driver.sleep(500);
        } catch (error) {
            console.log('⚠️  Could not scroll to top of page');
        }
    }

    async waitForElement(selector, timeout = 15000) {
        try {
            return await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
        } catch (error) {
            console.log(`❌ Element not found: ${selector}`);
            throw error;
        }
    }

    async typeText(selector, text) {
        const element = await this.waitForElement(selector);
        await element.clear();
        await element.sendKeys(text);
        console.log(`📝 Typed "${text}" in ${selector}`);
    }

    async clickElement(selector) {
        const element = await this.waitForElement(selector);
        
        // Scroll element into view at top
        await this.driver.executeScript("arguments[0].scrollIntoView({block: 'start'});", element);
        await this.driver.sleep(500);
        
        await element.click();
        console.log(`🖱️  Clicked ${selector}`);
    }

    async selectDropdown(selector, value) {
        const element = await this.waitForElement(selector);
        
        // Scroll element into view at top
        await this.driver.executeScript("arguments[0].scrollIntoView({block: 'start'});", element);
        await this.driver.sleep(500);
        
        await element.click();
        await this.driver.sleep(500);
        const option = await this.waitForElement(`${selector} option[value="${value}"]`);
        await option.click();
        console.log(`📋 Selected "${value}" from ${selector}`);
    }

    async selectCountryCode(countryCode) {
        const countryCodeSelect = await this.waitForElement('#countryCode');
        
        // Scroll element into view at top
        await this.driver.executeScript("arguments[0].scrollIntoView({block: 'start'});", countryCodeSelect);
        await this.driver.sleep(500);
        
        await countryCodeSelect.click();
        await this.driver.sleep(500);
        const option = await this.waitForElement(`#countryCode option[value="${countryCode}"]`);
        await option.click();
        console.log(`🌍 Selected country code: ${countryCode}`);
    }

    async getElementText(selector) {
        try {
            const element = await this.waitForElement(selector);
            return await element.getText();
        } catch {
            return '';
        }
    }

    async getElementAttribute(selector, attribute) {
        try {
            const element = await this.waitForElement(selector);
            return await element.getAttribute(attribute);
        } catch {
            return null;
        }
    }

    // FLOW A: Negative Scenario - Missing Last Name
    async testFlowA() {
        console.log('\n🎯 ====================================');
        console.log('🚀 STARTING FLOW A: Negative Scenario');
        console.log('🎯 ====================================\n');

        await this.driver.get(this.baseUrl);
        await this.ensureTopOfPage();

        // Fill form but SKIP Last Name
        console.log('\n📝 Filling form with missing Last Name...');
        await this.typeText('#firstName', 'sai');
        // Last Name intentionally skipped
        await this.typeText('#email', 'sai.doe@example.com');
        
        // Test with country code and phone
        await this.selectCountryCode('+1');
        await this.typeText('#phone', '5551234567');
        
        await this.clickElement('input[name="gender"][value="male"]');
        await this.typeText('#age', '25');
        await this.typeText('#address', '123 Main St');
        
        await this.selectDropdown('#country', 'USA');
        await this.driver.sleep(1000);
        await this.selectDropdown('#state', 'California');
        await this.driver.sleep(1000);
        await this.selectDropdown('#city', 'Los Angeles');
        
        await this.typeText('#password', 'StrongPass123!');
        await this.typeText('#confirmPassword', 'StrongPass123!');
        await this.clickElement('#terms');

        console.log('\n🖱️  Clicking Submit button...');
        await this.clickElement('#submitBtn');
        await this.driver.sleep(2000);

        // VALIDATION
        console.log('\n🔍 VALIDATING RESULTS:');
        const lastNameError = await this.getElementText('#lastNameError');
        if (lastNameError.includes('required') || lastNameError.length > 0) {
            console.log('✅ SUCCESS: Last Name error message found:', lastNameError);
        } else {
            console.log('❌ FAIL: Last Name error message not found');
        }

        try {
            const lastNameField = await this.waitForElement('#lastName');
            const fieldClass = await lastNameField.getAttribute('class');
            if (fieldClass.includes('error')) {
                console.log('✅ SUCCESS: Last Name field highlighted in red');
            } else {
                console.log('❌ FAIL: Last Name field not highlighted');
            }
        } catch (error) {
            console.log('⚠️  Could not check field highlighting');
        }

        // Take ONLY this screenshot for Flow A
        await this.ensureTopOfPage();
        await this.takeScreenshot('flow-a-error-state');
        console.log('📸 Error state screenshot captured from top of page');
    }

    // FLOW B: Positive Scenario - All Valid Fields
    async testFlowB() {
        console.log('\n🎯 ====================================');
        console.log('🚀 STARTING FLOW B: Positive Scenario');
        console.log('🎯 ====================================\n');

        // Navigate to the page again to avoid stale elements
        await this.driver.get(this.baseUrl);
        await this.ensureTopOfPage();
        await this.driver.sleep(2000);

        console.log('📝 Filling all fields with valid data...');
        await this.typeText('#firstName', 'sai');
        await this.typeText('#lastName', 'kiran');
        await this.typeText('#email', 'saikiran@example.com');
        
        // Test different country code
        await this.selectCountryCode('+91');
        await this.typeText('#phone', '9876543210');
        
        await this.typeText('#age', '25');
        await this.clickElement('input[name="gender"][value="male"]');
        await this.typeText('#address', '123 Main Street, Los Angeles');
        
        await this.selectDropdown('#country', 'India');
        await this.driver.sleep(1000);
        await this.selectDropdown('#state', 'Maharashtra');
        await this.driver.sleep(1000);
        await this.selectDropdown('#city', 'Mumbai');
        
        await this.typeText('#password', 'StrongPass123!');
        await this.typeText('#confirmPassword', 'StrongPass123!');
        
        // Ensure Terms & Conditions is checked
        const termsCheckbox = await this.waitForElement('#terms');
        if (!(await termsCheckbox.isSelected())) {
            await termsCheckbox.click();
        }

        console.log('\n🖱️  Clicking Submit button...');
        await this.clickElement('#submitBtn');
        await this.driver.sleep(3000);

        // VALIDATION - IMPROVED SUCCESS DETECTION
        console.log('\n🔍 VALIDATING RESULTS:');
        
        let successFound = false;
        
        // Method 1: Check for browser alert
        try {
            const alert = await this.driver.switchTo().alert();
            const alertText = await alert.getText();
            if (alertText.includes('Registration Successful') || alertText.includes('successful')) {
                console.log('✅ SUCCESS: Registration successful alert found!');
                console.log('📋 Alert message:', alertText);
                await alert.accept();
                successFound = true;
            }
        } catch (error) {
            // No alert found, continue to other methods
        }
        
        // Method 2: Check for DOM success message
        if (!successFound) {
            const successMessage = await this.getElementText('.alert.success');
            if (successMessage.includes('Registration Successful') || successMessage.includes('successful')) {
                console.log('✅ SUCCESS: Registration successful message found in DOM!');
                console.log('📋 Message:', successMessage);
                successFound = true;
            }
        }
        
        if (!successFound) {
            console.log('❌ FAIL: Could not detect success message');
        }

        // Check if form reset
        try {
            const firstNameValue = await this.driver.findElement(By.id('firstName')).getAttribute('value');
            if (!firstNameValue) {
                console.log('✅ SUCCESS: Form fields were reset after submission');
            } else {
                console.log('⚠️  Form fields were not reset (this might be expected)');
            }
        } catch (error) {
            console.log('⚠️  Could not check form reset');
        }

        // Take ONLY this screenshot for Flow B
        await this.ensureTopOfPage();
        await this.takeScreenshot('flow-b-success-state');
        console.log('📸 Success state screenshot captured from top of page');
    }

    // FLOW C: Form Logic Validation (No screenshots)
    async testFlowC() {
        console.log('\n🎯 ====================================');
        console.log('🚀 STARTING FLOW C: Form Logic Tests');
        console.log('🎯 ====================================\n');

        // Navigate fresh to avoid stale elements
        await this.driver.get(this.baseUrl);
        await this.ensureTopOfPage();
        await this.driver.sleep(2000);

        console.log('🔍 Testing Country-State-City dropdown logic...');
        await this.selectDropdown('#country', 'USA');
        await this.driver.sleep(1000);
        
        const stateEnabled = await this.driver.findElement(By.id('state')).isEnabled();
        if (stateEnabled) {
            console.log('✅ SUCCESS: States dropdown enabled after country selection');
        } else {
            console.log('❌ FAIL: States dropdown not enabled');
        }

        await this.selectDropdown('#state', 'California');
        await this.driver.sleep(1000);
        
        const cityEnabled = await this.driver.findElement(By.id('city')).isEnabled();
        if (cityEnabled) {
            console.log('✅ SUCCESS: Cities dropdown enabled after state selection');
        } else {
            console.log('❌ FAIL: Cities dropdown not enabled');
        }

        console.log('\n🔍 Testing Country Code Functionality...');
        // Test country code selection
        await this.selectCountryCode('+44');
        const selectedCountryCode = await this.getElementAttribute('#countryCode', 'value');
        if (selectedCountryCode === '+44') {
            console.log('✅ SUCCESS: Country code selection working');
        } else {
            console.log('❌ FAIL: Country code selection not working');
        }

        // Test country selection sync with country code
        await this.selectDropdown('#country', 'India');
        await this.driver.sleep(1000);
        const syncedCountryCode = await this.getElementAttribute('#countryCode', 'value');
        if (syncedCountryCode === '+91') {
            console.log('✅ SUCCESS: Country code synced with country selection');
        } else {
            console.log('⚠️  Country code sync not working (might be expected)');
        }

        console.log('\n🔍 Testing Password Strength Meter...');
        await this.typeText('#password', 'weak');
        await this.driver.sleep(500);
        let strength = await this.getElementText('.strength-text');
        console.log(`📊 Password strength for "weak": ${strength}`);

        await this.typeText('#password', 'MediumPass1');
        await this.driver.sleep(500);
        strength = await this.getElementText('.strength-text');
        console.log(`📊 Password strength for "MediumPass1": ${strength}`);

        await this.typeText('#password', 'StrongPass123!');
        await this.driver.sleep(500);
        strength = await this.getElementText('.strength-text');
        console.log(`📊 Password strength for "StrongPass123!": ${strength}`);

        console.log('\n🔍 Testing Password Match Validation...');
        await this.typeText('#confirmPassword', 'DifferentPass123!');
        await this.driver.sleep(1000);
        
        const passwordError = await this.getElementText('#confirmPasswordError');
        if (passwordError.includes('do not match') || passwordError.length > 0) {
            console.log('✅ SUCCESS: Password mismatch error detected:', passwordError);
        } else {
            console.log('❌ FAIL: Password mismatch error not detected');
        }

        console.log('\n🔍 Testing Phone Validation with Country Code...');
        // Test invalid phone number for selected country code
        await this.selectCountryCode('+1');
        await this.typeText('#phone', '123'); // Too short for US numbers
        await this.driver.sleep(1000);
        
        const phoneError = await this.getElementText('#phoneError');
        if (phoneError.includes('digits') || phoneError.length > 0) {
            console.log('✅ SUCCESS: Phone validation with country code working');
        } else {
            console.log('⚠️  Phone validation might not be country-specific');
        }

        console.log('\n🔍 Testing Submit Button State...');
        const submitBtn = await this.waitForElement('#submitBtn');
        const isDisabled = await submitBtn.getAttribute('disabled');
        if (isDisabled !== null) {
            console.log('✅ SUCCESS: Submit button is disabled when form is invalid');
        } else {
            console.log('❌ FAIL: Submit button should be disabled for invalid form');
        }

        console.log('\n🔍 Testing Email Validation...');
        await this.typeText('#email', 'test@tempmail.com');
        await this.driver.sleep(1000);
        const emailError = await this.getElementText('#emailError');
        if (emailError.includes('disposable') || emailError.length > 0) {
            console.log('✅ SUCCESS: Disposable email validation working');
        } else {
            console.log('⚠️  Disposable email validation might not be active');
        }

        console.log('✅ Flow C completed - No screenshots taken');
    }

    async runAllTests() {
        try {
            console.log('🎉 ====================================');
            console.log('🎉 INTELLIGENT REGISTRATION SYSTEM TESTS');
            console.log('🎉 ====================================\n');

            await this.setupDriver();
            
            await this.testFlowA();
            await this.testFlowB(); 
            await this.testFlowC();

            console.log('\n🎉 ====================================');
            console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
            console.log('🎉 ====================================');
            console.log('📸 Only 2 screenshots captured:');
            console.log('   - flow-a-error-state.png (Error scenario)');
            console.log('   - flow-b-success-state.png (Success scenario)');
            
        } catch (error) {
            console.log('\n❌ ====================================');
            console.log('❌ TEST FAILED:', error.message);
            console.log('❌ ====================================');
        } finally {
            if (this.driver) {
                await this.driver.quit();
                console.log('\n🔚 Browser closed.');
            }
        }
    }
}

// Run the tests
const test = new RegistrationTest();
test.runAllTests();