const puppeteer = require('puppeteer');
const request = require('request');
const cheerio = require('cheerio');
async function sendLink(link, browserOpenInstance) {
    // console.log(link);
    try {
        let page = await browserOpenInstance.newPage();
        await getimg(page, link, { delay: 10 });
        // await page.goto(link,{waitUntil: 'load', timeout: 0});
        // await page.waitForNavigation();
        // let i = 1;
        // await page.screenshot({path:`img${i++}`})

        await browserOpenInstance.close();

    } catch (error) {
        console.log(error);
    }

}

async function getimg(page, link) {
    await page.goto(link, { delay: 10 })
    for (let i = 1; i <= 10; i++){
        await page.screenshot({ path: `img${i}.png` });

    }
}

module.exports = {
    sendLinkkey: sendLink
}
