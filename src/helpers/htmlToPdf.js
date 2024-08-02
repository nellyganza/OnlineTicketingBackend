const html_to_pdf = require('html-pdf-node');
import { jsPDF } from "jspdf";

const htmlToPdf = async (html, outputPath) => {
  let pdf;
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [4, 2]
    });
    const options = { landscape: true };
    const file = { content: html };
    pdf = await html_to_pdf.generatePdf(file, options);
  } catch (error) {
    console.log(error);
  }
  return pdf;
};
export default htmlToPdf;
