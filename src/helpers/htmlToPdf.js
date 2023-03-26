const puppeteer = require('puppeteer');
const fs = require('fs');

const htmlToPdf = async (html, outputPath) => {
  let pdf;
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
      timeout: 0,
    });
    const page = await browser.newPage();
    await page.emulateMediaType('screen');
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });
    pdf = await page.pdf({
      path: outputPath,
      width: '850',
      height: '300',
      printBackground: true,
    });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
  return pdf;
};
export default htmlToPdf;
