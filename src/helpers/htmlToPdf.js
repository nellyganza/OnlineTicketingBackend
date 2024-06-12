const html_to_pdf = require('html-pdf-node');

const htmlToPdf = async (html, outputPath) => {
  let pdf;
  try {
    const options = { format: 'A4', printBackground: true, landscape: true };
    const file = { content: html };
    pdf = await html_to_pdf.generatePdf(file, options);
  } catch (error) {
    console.log(error);
  }
  return pdf;
};
export default htmlToPdf;
