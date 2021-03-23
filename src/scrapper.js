const puppeteer = require('puppeteer');

async function fetchCovidData() {
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
  await page.goto('https://www.coronatracker.com/analytics/');

  await page.waitForSelector('tbody tr', {
    visible: true
  })

   const data = await page.evaluate(() => {
       
       let data = [];
       const elements = document.querySelectorAll('div.w-full.rounded.shadow-md.bg-white.p-3.mb-5.block.lg\\:hidden > div.mt-3 > table > tbody > tr');
    for(const element of elements) {
        data.push({
            country: element.querySelector('tbody tr a').textContent.trim(),
            confirmed : element.querySelector('td:nth-child(2)').textContent.trim(),
            recovered : element.querySelector('td:nth-child(3)').textContent.trim(),
            deaths : element.querySelector('td:nth-child(4)').textContent.trim()
            
    })
    }
    return data;
  });
  
  console.log(data.filter(d => d.country === 'Brazil'));
   await browser.close();
   return data;

}

module.exports = fetchCovidData;