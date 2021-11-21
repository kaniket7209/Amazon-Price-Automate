const puppeteer = require('puppeteer');
// const minimal_args = [
//     '--autoplay-policy=user-gesture-required',
//     '--disable-background-networking',
//     '--disable-background-timer-throttling',
//     '--disable-backgrounding-occluded-windows',
//     '--disable-breakpad',
//     '--disable-client-side-phishing-detection',
//     '--disable-component-update',
//     '--disable-default-apps',
//     '--disable-dev-shm-usage',
//     '--disable-domain-reliability',
//     '--disable-extensions',
//     '--disable-features=AudioServiceOutOfProcess',
//     '--disable-hang-monitor',
//     '--disable-ipc-flooding-protection',
//     '--disable-notifications',
//     '--disable-offer-store-unmasked-wallet-cards',
//     '--disable-popup-blocking',
//     '--disable-print-preview',
//     '--disable-prompt-on-repost',
//     '--disable-renderer-backgrounding',
//     '--disable-setuid-sandbox',
//     '--disable-speech-api',
//     '--disable-sync',
//     '--hide-scrollbars',
//     '--ignore-gpu-blacklist',
//     '--metrics-recording-only',
//     '--mute-audio',
//     '--no-default-browser-check',
//     '--no-first-run',
//     '--no-pings',
//     '--no-sandbox',
//     '--no-zygote',
//     '--password-store=basic',
//     '--use-gl=swiftshader',
//     '--use-mock-keychain',
//   ];


const request = require('request');
const cheerio = require('cheerio');
const sendLinkObj = require('./prodPage');
let url = "https://www.amazon.in";
let inputArr = process.argv.slice(2);
let productName = inputArr + "";
let ctab;




(async function () {
    try {
        const browserOpenInstance = await puppeteer.launch(
            {
                headless: false,
                args: ['--start-maximized'],
                defaultViewport: null
            }
        )
        let AllTab = await browserOpenInstance.pages();
        ctab = AllTab[0];

        await ctab.goto(url);
        await ctab.waitForSelector('input[type="text"]')
        await ctab.type('input[type="text"]', productName);
        await ctab.keyboard.press('Enter');
        // console.log(ctab.url());
        await ctab.waitForSelector('input[type="text"]')
        let newpage = await browserOpenInstance.newPage();
        await newpage.goto(ctab.url())
        request(ctab.url(), function (err, response, html) {
            if (err) {
                console.log(Error);
            }
            else {
                // console.log(html);
                handleHtml(html,browserOpenInstance)
            }
        })
        // console.log(process.argv[2])
        // await newpage.screenshot({path:'img.png'})
        await newpage.waitForSelector('span.a-size-medium.a-color-base.a-text-normal')
        let namelist = await newpage.evaluate(getname, 'span.a-size-medium.a-color-base.a-text-normal', '.a-price-whole', process.argv[2]);
        console.log(namelist)
        
        // await browserOpenInstance.close();


    } catch (error) {
        console.log(error);
    }

})();
function handleHtml(html,browserOpenInstance) {
    let $ = cheerio.load(html);
    let href;
    let fullLink = "";
    let hrefEle = $('.a-link-normal.a-text-normal');
    for (let i = 0; i < hrefEle.length; i++) {
        let nameCheck = $(hrefEle[i]).text();
        if (nameCheck.indexOf(process.argv[2] + "") != -1) {

            href = $(hrefEle[i]).attr("href");
            fullLink = url + href;
            // console.log(fullLink);
            sendLinkObj.sendLinkkey(fullLink,browserOpenInstance);
        }
    }
}

function getname(Nselector, Pselector, firstWord) {
    let nameArray = document.querySelectorAll(Nselector)
    let priceArray = document.querySelectorAll(Pselector)
    let listOfName = []

    for (let i = 0, j = 0; i < nameArray.length && j < priceArray.length; i++, j++) {
        let name = nameArray[i].innerText;
        name = name + "";
        name = name.split(")")[0] + "";
        let price = priceArray[j].innerText;
        if (name.indexOf(firstWord) != -1) {
            // if (name.includes(firstWord+"")) {
            name = name + ")";
            listOfName.push({ name, price });// this is object and pushed inside array



        }
    }
    return listOfName; // this will return arrays of objects-- i.e ( likely as JSON )
}

