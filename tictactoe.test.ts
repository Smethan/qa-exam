import { Builder, Capabilities, By } from "selenium-webdriver"

const chromedriver = require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeAll(async () => {
    await driver.get('http://localhost:4000')
})

afterAll(async () => {
    await driver.quit()
})

test('I can start a game', async () => {

    let button = await (await driver).findElement(By.id('start-game'));
    await button.click();
    
});

test('I can click the first cell', async () => {
    let cell = await driver.findElement(By.id('cell-0'));
    await cell.click();
})

test('I can click the last cell', async () => {
    let finalCell = await driver.findElement(By.id('cell-8'));
    await finalCell.click();
})